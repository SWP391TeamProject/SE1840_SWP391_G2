import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { getCookie } from '@/utils/cookies';
import axios from 'axios';

class BlogService {
    private static readonly BASE_URL = `${SERVER_DOMAIN_URL}/api/blogs`;

    public static getAllBlogs(page: number, size: number) {
        let params = {
            page: page,
            size: size,
        }
        return axios.get(`${this.BASE_URL}/`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
            params: params
        });
    }

    public static searchBlog(keyword: string, page: number, size: number) {
        let params = {
            page: page,
            size: size,
        }
        return axios.get(`${this.BASE_URL}/search?keyword=${keyword}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + JSON.parse(getCookie("user")).accessToken || "",

            },
            params: params
        });
    }

    public static getBlogByCategory(categoryId: number, page: number, size: number) {
        return axios.get(`${this.BASE_URL}/category?categoryId=${categoryId}&pageNumb=${page}&pageSize=${size}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
    
                },
            }
        );
    }

    public static getBlogById(id: number) {
        return axios.get(`${this.BASE_URL}/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
    
                },
            }
        );
    }

    public static createBlog(blog: any) {
        return axios.post(this.BASE_URL+"/",blog, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + JSON.parse(getCookie("user")).accessToken || "",
            },
        });
    }

    public static updateBlog(id: number, blog: any) {
        return axios.put(`${this.BASE_URL}/${id}`, blog);
    }

    public static deleteBlog(id: number) {
        return axios.delete(`${this.BASE_URL}/${id}`);
    }
}

export default BlogService;