# TODO - Role-based Post Filtering

## Progress:
- [x] 1. Extend auth.d.ts to include user roles in session
- [x] 2. Update NextAuth route to include roles in JWT and session
- [x] 3. Create new API route for filtered posts (src/app/api/posts/route.ts)
- [x] 4. Update search route with role-based filtering
- [x] 5. Update main page to support filterByRole parameter
- [x] 6. Update SortPopup with interactive dropdown for role filtering

## Summary

Реализована фильтрация постов по ролям пользователя через SortPopup:

### Логика работы:
- **По умолчанию** - все пользователи видят все посты
- **При нажатии на SortPopup** - можно включить фильтр "По моим ролям"

### Роли и фильтры (когда включен фильтр):
- **admin_role** - видит все посты
- **coordinator_role** - видит все посты
- **videomaker_role** - видит посты с `post_needs_video_maker = true`
- **photographer_role** - видит посты с `post_needs_photogallery = true`
- **designer_role** - видит посты с `post_needs_cover_photo = true` ИЛИ `post_needs_photo_cards = true`
- **SMM_role** - видит посты с `post_needs_video_smm = true` ИЛИ `post_needs_text = true`

### Измененные файлы:
1. `src/lib/auth.d.ts` - расширены типы сессии и JWT
2. `src/lib/auth-config.ts` - создана конфигурация NextAuth с ролями
3. `src/app/api/auth/[...nextauth]/route.ts` - упрощен, использует authOptions
4. `src/app/api/posts/route.ts` - API endpoint с поддержкой параметра `filterByRole`
5. `src/app/api/posts/search/route.ts` - обновлен с фильтрацией по ролям
6. `src/app/(root)/page.tsx` - поддержка параметра `filterByRole` в URL
7. `src/components/shared/sort-popup.tsx` - интерактивный dropdown с опциями "Все посты" / "По моим ролям"
8. `src/components/shared/top-bar.tsx` - добавлен Suspense для SortPopup
