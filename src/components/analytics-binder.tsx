'use client';
import { useEffect } from 'react';

export default function AnalyticsBinder({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isWatchButton = (el: Element) =>
      el instanceof HTMLElement &&
      (el.textContent?.trim().toLowerCase() === 'смотреть' ||
       el.getAttribute('data-analytics')?.includes('watch'));

    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      // Поднимаемся по DOM, ищем родителя-кнопку "Смотреть"
      let el: HTMLElement | null = target;
      for (let i = 0; i < 4 && el; i++) {
        if (isWatchButton(el)) {
          // Получаем информацию о серии/сезоне из data-атрибутов или DOM
          const currentPath = window.location.pathname;
          let seasonNumber = '';
          let episodeNumber = '';
          let episodeTitle = '';
          let buttonType = '';

          // Сначала пытаемся получить данные из data-атрибутов кнопки
          if (el.getAttribute('data-analytics')) {
            buttonType = el.getAttribute('data-analytics') || '';
            seasonNumber = el.getAttribute('data-season') || '';
            episodeNumber = el.getAttribute('data-episode') || '';
            episodeTitle = el.getAttribute('data-episode-title') || '';
          }

          // Если данных нет в кнопке, пытаемся найти в DOM
          if (!seasonNumber && currentPath.includes('/gallery/episode/')) {
            const seasonBadge = document.querySelector('[data-season]');
            const episodeBadge = document.querySelector('[data-episode]');
            const episodeTitleEl = document.querySelector('h1');

            seasonNumber = seasonBadge?.getAttribute('data-season') || seasonBadge?.textContent?.replace(/\D/g, '') || '';
            episodeNumber = episodeBadge?.getAttribute('data-episode') || episodeBadge?.textContent?.replace(/\D/g, '') || '';
            episodeTitle = episodeTitleEl?.textContent?.split(' - ')[0] || '';
          }

          // Отправляем цель с параметрами
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as { ym?: (...args: any[]) => any }).ym?.(104652080, 'reachGoal', 'watch_click', {
            button_type: buttonType,
            season: seasonNumber,
            episode: episodeNumber,
            title: episodeTitle,
            url: currentPath
          });
          
          console.log('Yandex Metrika: watch_click event sent', {
            button_type: buttonType,
            season: seasonNumber,
            episode: episodeNumber,
            title: episodeTitle,
            url: currentPath
          });
          
          break;
        }
        el = el.parentElement;
      }
    };

    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  return <>{children}</>;
}
