create view due_users as
  select distinct users.id,
    dates.last_delivered,
    users.kindle_address
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

create view digests_with_meta as
  select digests.id,
    digests.delivered_at,
    digests.user_id,
    count(articles.id) as articles_count
  from digests
  left join articles on articles.digest_id = digests.id
  group by digests.id;
