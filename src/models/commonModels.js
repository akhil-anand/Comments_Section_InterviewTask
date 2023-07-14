export const CommentObj = (comment, id, parentId) => ({
  id,
  parentId: parentId ?? null,
  comment,
  timestamp: new Date(),
  replies: []
});
