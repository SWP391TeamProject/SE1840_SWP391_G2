import { SERVER_DOMAIN_URL } from '@/constants/domain';
import { getCookie, removeCookie } from '@/utils/cookies';
import axios from '@/config/axiosConfig.ts';

interface GetBlogsSchema {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  categoryId?: number;
  search: string;
}

class BlogService {
  private static readonly BASE_URL = `${SERVER_DOMAIN_URL}/api/blogs`;

  public static getBlogs = async (input: GetBlogsSchema) => {
    try {
      const { page, size, sort, order, categoryId } = input;
      let response;

      if (categoryId > -1) {
        let params = {
          page: page - 1 || 0,
          size: size || 10,
          sort,
          order,
          search:input.search
        };
        response = await axios.get(`${this.BASE_URL}/category?categoryId=${categoryId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
          },
          params: params,
        });
      } else {
        let params: Record<string, any> = {
          page: page - 1, // Spring Boot uses 0-based page index
          size: size ? size : 10,
          sort,
          order,
          search:input.search
        };

        response = await axios.get(`${this.BASE_URL}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
          },
          params: params,
        });
      }
      // Prepare query parameters
      return response.data;
    } catch (err) {
      console.log(err);
      if (err?.response.status == 401) {
        removeCookie('user');
        removeCookie('token');
      }
    }
  };

  public static getAllBlogs(page?: number, size?: number) {
    let params = {
      page: page || 0,
      size: size || 50,
    };
    return axios.get(`${this.BASE_URL}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });
  }

  public static searchBlog(keyword: string, page: number, size: number) {
    let params = {
      page: page,
      size: size,
    };
    return axios.get(`${this.BASE_URL}/search?keyword=${keyword}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });
  }

  public static getBlogByCategory(categoryId: number, page: number, size: number) {
    let params = {
      page: page || 0,
      size: size || 50,
    };
    return axios.get(`${this.BASE_URL}/category?categoryId=${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    });
  }

  public static getBlogById(id: number) {
    return axios.get(`${this.BASE_URL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static createBlog(blog: any) {
    return axios.post(this.BASE_URL + '/', blog, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    });
  }

  public static updateBlog(id: number, blog: any) {
    return axios.put(`${this.BASE_URL}/${id}`, blog, {
      headers: {
        'Content-Type': 'multipart/form-data',

        Authorization: 'Bearer ' + JSON.parse(getCookie('user')).accessToken || '',
      },
    });
  }

  public static deleteBlog(id: number) {
    return axios.delete(`${this.BASE_URL}/${id}`);
  }
}

export default BlogService;
