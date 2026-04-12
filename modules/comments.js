export let commentsData = [];

export const updateComments = (newComments) => {
  commentsData.length = 0;
  newComments.forEach((comment) => commentsData.push(comment));
};
