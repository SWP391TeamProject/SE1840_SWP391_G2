import { BlogPost } from "@/models/newModel/blogPost";
import { createSlice } from "@reduxjs/toolkit"

interface BlogPostsState {
    loading: boolean,
    value: BlogPost[],
    currentBlogPost?: BlogPost,
    currentPageList: BlogPost[],
    currentPageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    error: string
}

// Define the initial state using that type
const initialState: BlogPostsState = {
    loading: true,
    value: [],
    currentBlogPost: undefined,
    currentPageList: [],
    currentPageNumber: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    error: ''
}

export const blogPostsSlice = createSlice({
    name: 'blogPosts',
    initialState,
    reducers: {
        setBlogPosts: (state, action) => {
            state.value = action.payload;
            state.totalItems = action.payload.length;
        },
        setCurrentBlogPost: (state, action) => {
            state.currentBlogPost = action.payload;
        },
        setCurrentPageNumber: (state, action) => {
            state.currentPageNumber = action.payload.pageNumber;
            state.totalPages = action.payload.totalPages;
        },
        setCurrentPageList: (state, action) => {
            state.currentPageList = action.payload;
        },

    },
});


export const { setBlogPosts, setCurrentBlogPost, setCurrentPageList, setCurrentPageNumber, error } = blogPostsSlice.actions;
export default blogPostsSlice.reducer