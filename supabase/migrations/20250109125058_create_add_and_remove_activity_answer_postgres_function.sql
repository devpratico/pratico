set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_activity_answer(room_id integer, answer jsonb)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
  updated_snapshot jsonb;
begin
  -- Lock the row to prevent concurrent updates
  select activity_snapshot
  into updated_snapshot
  from rooms
  where id = room_id
  for update;

  -- Update the activity_snapshot JSONB with the new answer
  updated_snapshot := jsonb_set(
    updated_snapshot,
    '{answers}',
    coalesce(updated_snapshot->'answers', '[]'::jsonb) || answer,
    true
  );

  -- Save the updated JSONB back to the table
  update rooms
  set activity_snapshot = updated_snapshot
  where id = room_id;

  return 'done';
end;
$function$
;

CREATE OR REPLACE FUNCTION public.remove_activity_answer(room_id integer, user_id text, question_id text, choice_id text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
  updated_snapshot jsonb; -- Variable to store the modified JSONB
begin
  -- Filter the answers array to remove the matching answer
  select jsonb_set(
    activity_snapshot,
    '{answers}',
    coalesce(
      jsonb_agg(elems) 
      filter (
        where elems->>'userId' != user_id
          or elems->>'questionId' != question_id
          or elems->>'choiceId' != choice_id
      ), 
      '[]'::jsonb
    ),
    true
  )
  into updated_snapshot
  from rooms, jsonb_array_elements(activity_snapshot->'answers') as elems
  where id = room_id;

  -- Update the row with the new activity_snapshot
  update rooms
  set activity_snapshot = updated_snapshot
  where id = room_id;

  return 'done';
end;
$function$
;


