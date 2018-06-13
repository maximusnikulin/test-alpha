const Home = {
  template: `<div>Главная Страница</div>`
}

const Top = {
  template: `
    <div>
      <table>
        <thead> 
          <tr>
            <th>Rate</th>
            <th>Name</th>
            <th>Status</th>
            <th>Exp</th>
            <th>Money</th>        
          </tr>
        <thead/>
        <tbody>
          <tr v-for="(item, index) in personsRating">
            <td>{{item.rate}}</td>
            <td>{{item.fio}}</td>
            <td>{{item.level}}</td>
            <td>{{item.exp}}</td>        
            <td>{{item.money}}</td>
          </tr>
        </tbody> 
      </table>
    </div>`,
  data () {
    return {
      persons: this.$attrs.persons
    }
  },
  computed: {
    personsRating () {
      const sortedPersonsWithExp = this.$attrs.persons.slice().sort((cur, next) => next.sum - cur.sum)

      var j = 0
      var rate = 1

      // rate <= 5 for only first five participants
      // but top five it doesn't mean that list count always five
      while (j < sortedPersonsWithExp.length && rate <= 5) {
        sortedPersonsWithExp[j].rate = rate

        if (j === sortedPersonsWithExp.length - 1) {
          break
        }

        if (sortedPersonsWithExp[j].sum !== sortedPersonsWithExp[j + 1].sum) {
          rate++
        }

        j++
      }

      return sortedPersonsWithExp
    }
  }
}

const Full = {
  template: `
    <div>
      <table>
        <thead> 
          <tr>            
            <th>Name</th>
            <th>Status</th>
            <th>Exp</th>
            <th>Money</th>        
          </tr>
        <thead/>
        <tbody>
          <tr v-for="(item, index) in persons">            
            <td>{{item.fio}}</td>
            <td>{{item.level}}</td>
            <td>{{item.exp}}</td>        
            <td>{{item.money}}</td>
          </tr>
        </tbody> 
      </table>
    </div>`,
  data () {
    return {
      persons: this.$attrs.persons
    }
  }
}

const routes = [
  {path: '/home', component: Home},
  {path: '/top', component: Top},
  {path: '/full', component: Full}
]

// eslint-disable-next-line
const router = new VueRouter({
  routes,
  mode: 'history'
})

// eslint-disable-next-line
var vm = new Vue({
  el: '#app',
  data () {
    return {
      ready: false,
      loading: false,
      persons: []
    }
  },
  router,
  computed: {
    personsWithExp () {
      return this.persons.map((el) => {
        let resources = JSON.parse(el.resources)
        el.exp = resources.reduce((exp, next) => {
          switch (next.resource) {
            case 'ACTIVERATE':
            case 'PASSIVERATE': exp += next.value
              break
            case 'MONEY': el.money = next.value
              break
          }
          return exp
        }, 0)

        el.sum = el.money + el.exp
        return el
      })
    }
  },
  methods: {
    getListPersons () {
      this.loading = true
      fetch('/persons')
        .then(res => res.json())
        .then(persons => {
          this.loading = false
          this.persons = persons
        })
    }
  },
  mounted () {
    document.getElementById('app').classList.remove('hide')
    this.getListPersons()
  }
})
