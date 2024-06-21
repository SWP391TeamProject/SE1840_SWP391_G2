import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { getCookie } from '@/utils/cookies';
import axios from 'axios';

class BlogCategoryService {
    private static readonly BASE_URL = `${SERVER_DOMAIN_URL}/api/blog-categories`;

    public static getAllBlogCategories(page: number, size: number) {
        let params = {
            page: page,
            size: size,
        }
        return axios.get(`${this.BASE_URL}/`, {
            headers: {
                "Content-Type": "application/json",
            },
            params: params
        });
    }

    public static getBlogCategoryById(id: number) {
        return axios.get(`${this.BASE_URL}/${id}`);
    }

    public static createBlogCategory(blogCategory: any) {
        return axios.post(this.BASE_URL, blogCategory);
    }

    public static updateBlogCategory(id: number, blogCategory: any) {
        return axios.put(`${this.BASE_URL}/${id}`, blogCategory);
    }

    public static deleteBlogCategory(id: number) {
        return axios.delete(`${this.BASE_URL}/${id}`);
    }
}

export default BlogCategoryService;