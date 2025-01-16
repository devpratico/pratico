set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.remove_activity_answer(room_id integer, user_id text, question_id text, choice_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
  updated_snapshot jsonb; -- Variable to store the modified JSONB
begin
  -- Filter the answers array to exclude the matching answer
  select jsonb_set(
    activity_snapshot,
    '{answers}',
    coalesce((
      select jsonb_agg(elems)
      from jsonb_array_elements(activity_snapshot->'answers') as elems
      where elems->>'userId' != user_id
        or elems->>'questionId' != question_id
        or elems->>'choiceId' != choice_id
    ), '[]'::jsonb), -- Ensure it defaults to an empty array if no elements remain
    true
  )
  into updated_snapshot
  from rooms
  where id = room_id;

  -- Update the row with the modified activity_snapshot
  update rooms
  set activity_snapshot = updated_snapshot
  where id = room_id;

  return 'done';
end;
$function$
;


