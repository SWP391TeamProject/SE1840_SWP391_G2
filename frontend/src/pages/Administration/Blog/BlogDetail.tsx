import { BlogPost } from '@/models/newModel/blogPost'
import { useAppSelector } from '@/redux/hooks';
import React from 'react'

export const BlogDetail = () => {
    const blog = useAppSelector((state) => state.blogs.currentBlogPost);

    let temp = blog?.content?.split('&lt;img/&gt;');
    for (let i = 0; i < temp?.length - 1; i++) {
        temp[i] += `<div style="">
        <img src="${blog?.attachments[i]?.link}" alt="blog img" style="width:70%; border-radius:10px;margin:auto"/>
        </div>`;
    }
    const utc_date = new Date(blog?.updateDate);  
    // Get current UTC date and time

    const blogDate=(`${utc_date.getDate()}/${utc_date.getMonth()<9?'0':''}${utc_date.getMonth() + 1}/${utc_date.getFullYear()}`);  

    let content = temp?.join('\n');
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
                <article className="prose prose-gray dark:prose-invert mx-auto max-w-3xl">
                    <header className="mb-8">
                        <div className="items-center mb-2">
                            <h1 className="text-4xl font-bold mb-4">{blog?.title}</h1>

                            <div className="flex items-center space-x-2">
                                <img src={blog?.author?.avatar?.link || "/placeholder.svg"} alt="Author Avatar" width={40} height={40} className="rounded-full" />
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">By {blog?.author?.nickname} • Published on {blogDate}</p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="[&>*]:my-6 px-16" >
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </article>

            </div>
        </div>
    )
}
