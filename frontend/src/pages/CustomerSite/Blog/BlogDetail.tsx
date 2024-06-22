import Footer from '@/components/footer/Footer';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCurrentBlogPost } from '@/redux/reducers/Blogs';
import BlogService from '@/services/BlogService';
import { set } from 'date-fns';
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const BlogDetail = () => {
    const blogList = useAppSelector((state) => state.blogs.currentPageList);
    const currentBlog = useAppSelector((state) => state.blogs.currentBlogPost);
    const [newBlogs, setNewBlogs] = React.useState([]);
    const [relatedBlogs, setRelatedBlogs] = React.useState([]);
    const dispatch = useAppDispatch();
    const [reload, setReload] = React.useState(false);
    const param = useParams();

    let temp = currentBlog?.content?.split('&lt;img/&gt;');
    for (let i = 0; i < temp?.length - 1; i++) {
        temp[i] += `<div style="">
        <img src="${currentBlog?.attachments[i]?.link}" alt="blog img" style="width:70%; border-radius:10px;margin:auto"/>
        </div>`;
    }
    const utc_date = new Date(currentBlog?.updateDate);
    // Get current UTC date and time

    const blogDate = (`${utc_date.getDate()}/${utc_date.getMonth() < 9 ? '0' : ''}${utc_date.getMonth() + 1}/${utc_date.getFullYear()}`);

    let content = temp?.join('\n');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setNewBlogs(blogList?.filter((blog) => blog.postId != currentBlog?.postId));
        setRelatedBlogs(blogList?.filter((blog) => blog.category.blogCategoryId == currentBlog?.category.blogCategoryId && blog.postId != currentBlog?.postId));
    }, [reload]);

    const handleViewDetailsClick = (id: any) => {
        let blog = newBlogs.find(b => b.postId == id);
        if (!blog) {
            blog = relatedBlogs.find(b => b.postId == id);
        }
        if (blog) {
            dispatch(setCurrentBlogPost(blog));
            setReload(!reload);
        }
    }

    return (
        <>
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
                <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
                    <article className="prose prose-gray dark:prose-invert w-full block md:flex justify-evenly ">
                        <div className='w-full  md:w-8/12 '>
                            <header className="mb-8">
                                <div className="items-center mb-2">
                                    <h1 className="text-4xl font-bold mb-4">{currentBlog?.title}</h1>

                                    <div className="flex items-center space-x-2">
                                        <img src={currentBlog?.author?.avatar?.link || "/placeholder.svg"} alt="Author Avatar" width={40} height={40} className="rounded-full" />
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">By {currentBlog?.author?.nickname} • Published on {blogDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <div className="[&>*]:my-6 md:px-16 w-full break-words" >
                                <div className='' dangerouslySetInnerHTML={{ __html: content }} />
                            </div>
                        </div>
                        <div className=' w-full md:w-2/5 '>
                            <h2 className="text-2xl font-bold mb-4 col-span-full">New Blogs
                                <hr />
                                <hr />

                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                                {newBlogs.map((blog, index) => (
                                    index > 3 || blog?.postId == currentBlog?.postId ? null :
                                        <div className="rounded-lg overflow-hidden shadow-lg border" key={blog.postId}>
                                            <img
                                                src={blog?.attachments[0]?.link || "/placeholder.svg"}
                                                width={400}
                                                height={225}
                                                alt="Recent Blog Post"
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="p-4 bg-white dark:bg-gray-950">
                                                <h3 className="text-lg font-bold mb-2">
                                                    {blog?.title}
                                                </h3>

                                                <Link
                                                    onClick={() => handleViewDetailsClick(blog.postId)}
                                                    to={`/blogs/${blog?.postId}`}
                                                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                                >
                                                    Read More
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                ))}

                            </div>
                            <h2 className="text-2xl font-bold mb-4 col-span-full">Related Blogs
                                <hr />
                                <hr />

                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {relatedBlogs.map((blog, index) => (
                                    index > 3 || blog?.postId == currentBlog?.postId ? null :
                                        <div className="rounded-lg overflow-hidden shadow-lg border" key={blog.postId}>
                                            <img
                                                src={blog?.attachments[0]?.link || "/placeholder.svg"}
                                                width={400}
                                                height={225}
                                                alt="Recent Blog Post"
                                                className="w-full h-40 object-cover"
                                            />
                                            <div className="p-4 bg-white dark:bg-gray-950">
                                                <h3 className="text-lg font-bold mb-2">
                                                    {blog?.title}
                                                </h3>

                                                <Link
                                                    onClick={() => handleViewDetailsClick(blog.postId)}
                                                    to={`/blogs/${blog?.postId}`}
                                                    className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                                                >
                                                    Read More
                                                    <ArrowRightIcon className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                ))}

                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <div className="sticky z-10 w-full">
                <Footer />
            </div>
        </>
    )
}
function ArrowRightIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}