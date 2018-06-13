-- CLIENT - @TABLE1
-- PURCHASE - @TABLE2

-- USING POSTGRES WINDOW FUNCTION
select *, value - temp_sum as diff from (select *, sum(amount) over (PARTITION BY client_id order by date asc) as temp_sum from purchase inner join client on purchase.client_id = client.id) as acc where acc.temp_sum <= acc.value;

-- USING INNER SQL, BUT IT VERY SLOW SOLUTION
select *, credit - temp_sum as diff 
from (
  select p.caption, p.date, p.id, p.client_id, p.amount, c.value as credit, sum(tm.amount) as temp_sum 
  from purchase p 
  inner join client c on p.client_id = c.id 
  inner join purchase tm on p.date >= tm.date and p.client_id = tm.client_id 
  group by p.caption, p.date, p.id, p.client_id, p.amount, value 
  order by client_id, p.date asc
) as res 
where res.temp_sum <= credit;