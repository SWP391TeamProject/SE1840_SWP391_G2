import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { showErrorToast } from '@/lib/handle-error';
import {getCookie, getBearerToken} from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';
import {Page} from "@/models/Page.ts";
import {BlogCategory} from "@/models/newModel/blogCategory.ts";





class BlogCategoryService {
  private static readonly BASE_URL = `${SERVER_DOMAIN_URL}/api/blog-categories`;

  public static getAllBlogCategories(page?: number, size?: number) {
    let params = {
      page: page || 0,
      size: size || 50,
    };
    return axios
      .get<Page<BlogCategory>>(`${this.BASE_URL}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: params,
      })
      .catch((error) => {
        showErrorToast(error);
      });
  }

  public static getBlogCategoryById(id: number) {
    return axios.get(`${this.BASE_URL}/${id}`);
  }

  public static createBlogCategory(name: string) {
    return axios
      .post(
        `${this.BASE_URL}/`,
        { blogCategoryId: -1, name: name, createDate: new Date(), updateDate: new Date() },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getBearerToken(),
          },
        }
      )
      .catch((error) => {
        showErrorToast(error);
      });
  }

  public static updateBlogCategory(id: number, blogCategory: any) {
    return axios.put(`${this.BASE_URL}/${id}`, blogCategory);
  }

  public static deleteBlogCategory(id: number) {
    return axios
      .post(`${this.BASE_URL}/delete/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getBearerToken(),
        },
      })
      .catch((error) => {
        showErrorToast(error);
      });
  }
}

export default BlogCategoryService;
