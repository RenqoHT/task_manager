# TODO: Реализация кнопки удаления поста

## Шаги:
- [x] Создать DELETE API маршрут - `src/app/api/posts/delete/[id]/route.ts`
- [x] Добавить константу DELETE_POST в `src/components/shared/services/constants.ts`
- [x] Добавить функцию delete в `src/components/shared/services/posts.ts`
- [x] Добавить кнопку удаления в `src/components/shared/choose-post-form.tsx` с подтверждением
- [x] Добавить проверку ролей (только admin и SMM могут удалять)
- [x] Исправить редирект после удаления (использовать router.back())
- [ ] Тестирование функционала

## Реализовано:
1. **API маршрут** (`src/app/api/posts/delete/[id]/route.ts`):
   - Обрабатывает DELETE запросы
   - Проверяет существование поста перед удалением
   - Проверка ролей: только `admin_role` или `SMM_role` могут удалять
   - Возвращает соответствующие статусы и сообщения (401, 403, 404, 500)

2. **Константа API** (`src/components/shared/services/constants.ts`):
   - Добавлен `DELETE_POST = 'posts/delete'`

3. **Сервис функция** (`src/components/shared/services/posts.ts`):
   - Добавлена функция `deletePost(id: number)` для вызова API

4. **UI кнопка** (`src/components/shared/choose-post-form.tsx`):
   - Добавлена кнопка "Удалить" с вариантом `destructive` (красная)
   - Кнопка отображается только пользователям с ролями admin или SMM
   - Реализовано подтверждение через `confirm()`
   - После удаления используется `router.back()` для закрытия модалки
   - Обработка ошибок с уведомлением пользователя

5. **Проверка ролей на сервере** (`src/app/(root)/@modal/(.)post/[id]/page.tsx`):
   - Получение сессии пользователя через `getServerSession`
   - Передача флага `canDelete` в компоненты

6. **Передача пропсов** (`src/components/shared/modals/choose-post-modal.tsx`):
   - Добавлен проп `canDelete` для передачи в форму
