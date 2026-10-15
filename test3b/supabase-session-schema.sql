create table if not exists public.app_sessions (
  id uuid primary key,
  started_at timestamptz not null,
  duration_seconds integer not null default 0 check (duration_seconds >= 0)
);

alter table public.app_sessions enable row level security;
revoke all on table public.app_sessions from anon, authenticated;

create or replace function public.record_app_session(
  p_id uuid,
  p_started_at timestamptz,
  p_duration_seconds integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_started_at > now() + interval '5 minutes'
     or p_started_at < now() - interval '7 days'
     or p_duration_seconds < 0
     or p_duration_seconds > 604800 then
    raise exception 'invalid session values';
  end if;

  insert into public.app_sessions (id, started_at, duration_seconds)
  values (p_id, p_started_at, p_duration_seconds)
  on conflict (id) do update
  set duration_seconds = greatest(app_sessions.duration_seconds, excluded.duration_seconds);
end;
$$;

revoke all on function public.record_app_session(uuid, timestamptz, integer) from public;
grant execute on function public.record_app_session(uuid, timestamptz, integer) to anon, authenticated;
