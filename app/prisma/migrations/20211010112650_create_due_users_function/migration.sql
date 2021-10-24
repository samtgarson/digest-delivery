create or replace function get_due_users ()
  returns setof users
as $$
begin
  return query select distinct users.*
  from users
    left join (
      select
        digests.user_id,
        max(digests.delivered_at) as last_delivered
      from digests
      group by digests.user_id
    ) dates on users.id = dates.user_id
    join articles on users.id = articles.user_id
  where users.active = true
  and articles.digest_id is null
  and (
    (now()::date - dates.last_delivered::date) >=
      case users.frequency
        when 'weekly'::text then 6
        else 1
      end
    or dates.last_delivered is null
  );
end; $$

language 'plpgsql';
