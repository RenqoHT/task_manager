# Post-Add Modal Update Tasks

## Files to Edit:
- [x] `src/components/shared/modals/post-add.tsx` - Add missing fields and fix field names
- [x] `src/app/api/posts/create/route.ts` - Fix field names to match Prisma schema
- [x] `src/components/shared/services/posts.ts` - Update PostCreationData type
- [x] `src/components/shared/post-edit-form.tsx` - Add feedback_comment field and update schema
- [x] `src/components/shared/choose-post-form.tsx` - Display feedback_comment and update schema
- [x] `src/app/api/posts/update/[id]/route.ts` - Fix field names and add feedback_comment


## Changes for post-add.tsx:
- [x] Add state for `needsMiniGallery` checkbox
- [x] Add state for `tzLink` field
- [x] Update field names to match Prisma schema
- [x] Add UI for mini gallery checkbox
- [x] Add UI for tz_link input
- [x] Update handleSubmit and handleClose functions


## Changes for create/route.ts:
- [x] Fix field names: `post_needs_video_smm` → `post_needs_mini_video_smm`
- [x] Fix field names: `post_needs_video_maker` → `post_needs_video`
- [x] Add handling for `post_needs_mini_gallery` and `tz_link`


## Changes for posts.ts:
- [x] Update PostCreationData type with correct field names
- [x] Add exclusions for fields with defaults: post_status, is_published, feedback_comment, approved_by_id


## Changes for post-edit-form.tsx:
- [x] Add state for `needsMiniGallery` checkbox
- [x] Add state for `tzLink` field
- [x] Add state for `feedbackComment` field
- [x] Update field names to match Prisma schema
- [x] Add UI for feedback_comment textarea
- [x] Update handleSubmit to include new fields


## Changes for choose-post-form.tsx:
- [x] Add display for `tz_link`
- [x] Add display for `feedback_comment` (highlighted in yellow block)
- [x] Add check for `post_needs_mini_gallery` in works status
- [x] Update field names to match Prisma schema


## Changes for update API route:
- [x] Fix field names to match Prisma schema
- [x] Add handling for `post_needs_mini_gallery`, `tz_link`, `feedback_comment`
