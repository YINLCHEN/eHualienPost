const initialState = {
    PostID: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_Office':
            return {
                PostName: action.postName,
                PostID: action.postID
            };
        case 'ADD_Performance':
            return {
                Amount: action.amount,
                Count: action.count,
                Comment: action.comment,
            };
        default:
            return state;
    }
}