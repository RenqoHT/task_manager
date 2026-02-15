# TODO - Role-based Post Filtering

## Progress:
- [x] 1. Extend auth.d.ts to include user roles in session
- [x] 2. Update NextAuth route to include roles in JWT and session
- [x] 3. Create new API route for filtered posts (src/app/api/posts/route.ts)
- [x] 4. Update search route with role-based filtering
- [x] 5. Update main page to support filterByRole parameter
- [x] 6. Update SortPopup with interactive dropdown for role filtering
- [x] 7. Fix Next.js 15+ Promise issue with searchParams

## Summary

Реализована фильтрация постов по ролям пользователя через SortPopup:

### Логика работы:
- **По умолчанию** - все пользователи видят все посты
- **При нажатии на SortPopup** - можно включить фильтр "По моим ролям"

### Роли и фильтры (когда включен фильтр):
- **admin_role** - видит все посты (только если нет других специфических ролей)
- **coordinator_role** - видит все посты (только если нет других специфических ролей)
- **videomaker_role** - видит посты с `post_needs_video_maker = true`
- **photographer_role** - видит посты с `post_needs_photogallery = true`
- **designer_role** - видит посты с `post_needs_cover_photo = true` ИЛИ `post_needs_photo_cards = true`
- **SMM_role** - видит посты с `post_needs_video_smm = true` ИЛИ `post_needs_text = true`

### Приоритет ролей:
Специфические роли (designer, videomaker, photographer, SMM) имеют приоритет над admin/coordinator. Если у пользователя есть designer_role И coordinator_role, при включенном фильтре он увидит только посты для дизайнера.

### Измененные файлы:
1. `src/lib/auth.d.ts` - расширены типы сессии и JWT
2. `src/lib/auth-config.ts` - создана конфигурация NextAuth с ролями
3. `src/app/api/auth/[...nextauth]/route.ts` - упрощен, использует authOptions
4. `src/app/api/posts/route.ts` - API endpoint с поддержкой параметра `filterByRole`
5. `src/app/api/posts/search/route.ts` - обновлен с фильтрацией по ролям
6. `src/app/(root)/page.tsx` - поддержка параметра `filterByRole` в URL (с await для Next.js 15+)
7. `src/components/shared/sort-popup.tsx` - интерактивный dropdown с опциями "Все посты" / "По моим ролям"
8. `src/components/shared/top-bar.tsx` - добавлен Suspense для SortPopup

### Как использовать:
1. Откройте главную страницу - видны все посты
2. Нажмите на "Фильтр: Все" в верхней панели
3. Выберите "По моим ролям" из выпадающего меню
4. Страница перезагрузится с фильтрацией по вашим ролям (URL: `?filterByRole=true`)
5. Чтобы вернуться ко всем постам - снова нажмите и выберите "Все посты"

### Отладка:
В консоли сервера выводятся отладочные сообщения:
- `User roles from session: {...}` - показывает роли текущего пользователя
- `Built where clause: {...}` - показывает SQL-условие для фильтрации

### Возможные проблемы:
- Если роли не применяются - проверьте что они сохранены в сессии (консоль)
- Если фильтр не работает - проверьте что `filterByRole=true` есть в URL
- Для Next.js 15+ используется `await searchParams` (Promise)
