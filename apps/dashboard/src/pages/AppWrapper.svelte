<script lang="ts">
  import { AuthShell, Dashboard } from '.';
  import { Route, useNavigate } from 'svelte-navigator';
  import { Redirect } from '../components';
  import { getAuth } from 'firebase/auth';
  import { onDestroy } from 'svelte';
  import { authState } from 'rxfire/auth';
  import {
    filter, first, map, pluck, shareReplay, switchMap, takeUntil,
  } from 'rxjs/operators';
  import { isDarkMode } from '@parrotly.io/ui/utils';
  import { SettingsService } from '../services';
  import { merge, Subject } from 'rxjs';

  const navigate = useNavigate();
  const settingsService = new SettingsService();
  const destroy = new Subject<boolean>();

  const auth$ = authState(getAuth()).pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  auth$.pipe(takeUntil(destroy)).subscribe((user) => {
    if (!user) navigate('/auth');
  });

  const userSettingsTheme$ = auth$.pipe(
    switchMap((user) => settingsService.docData$(user.uid)),
    pluck('theme'),
    filter(theme => Boolean(theme)),
    map((theme) => theme === 'dark'),
    takeUntil(destroy)
  );

  const darkTheme$ = merge(
    isDarkMode(destroy).pipe(first()),
    userSettingsTheme$
  ).subscribe((isDarkTheme) => {
    // if (isDarkTheme) document.documentElement.classList.add('dark');
    // else document.documentElement.classList.remove('dark');
  });

  onDestroy(() =>destroy.next());
</script>

<main
  class="flex flex-col max-w-screen-2xl items-stretch dark:bg-primary-800 bg-primary-100 w-screen p-3 pr-0 h-screen"
>
  <Route path="/auth/*" component={AuthShell} />
  <Route path="/dashboard/*" component={Dashboard} />
  <Route component={Redirect} to="auth" />
</main>
