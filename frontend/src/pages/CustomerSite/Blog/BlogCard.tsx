import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { BlogPost } from "@/models/newModel/blogPost";
import { useAppDispatch } from "@/redux/hooks";
import { setCurrentBlogPost } from "@/redux/reducers/Blogs";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP,);


interface BlogCardProps {
    blog: BlogPost;
    className: string;

}

export default function BlogCard({ blog ,className}: BlogCardProps) {
    const cardRef = useRef(null);
    const dispatch = useAppDispatch();
    useGSAP(() => {
        gsap.fromTo(cardRef.current,
            { y: 100, opacity: 0 },
            {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: "power3.out"
            }
        );
    }, { scope: cardRef });
    const handleViewDetailsClick = () => {

        // let blog = blogPosts.currentPageList.find((b) => b.postId == id);
        if (blog) {
            dispatch(setCurrentBlogPost(blog));
        }
    };
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(
                            cardRef.current,
                            { y: 150, opacity: 0 },
                            {
                                duration: 1,
                                y: 0,
                                opacity: 1,
                                ease: "power2.in",
                                onComplete: () => observer.unobserve(entry.target),
                            }
                        );
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the card is in view
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [cardRef]);
    return (
        <Card ref={cardRef} className={`w-[500px] ${cn(className)}`}>
            <CardHeader className="h-[300px]">
                <img
                    src={blog.attachments[0]?.link ?? 'https://fsilverman.com/wp-content/uploads/2021/07/iStock-494833184-gold-jewelry.jpg'}
                    // alt={blog.title}
                    className="w-full h-full object-cover"
                />
            </CardHeader>
            <CardContent >
                <div className={"h-36 overflow-hidden"}>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        {blog.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 ">
                        <div dangerouslySetInnerHTML={{ __html: `${blog?.content.split('&lt;img/&gt;').join(' ')}` }} />
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <div className="grid grid-cols-6 w-full">
                    <Button variant="default"  asChild >
                        <Link
                            onClick={() => handleViewDetailsClick()}
                            to={`/blogs/${blog?.postId}`}
                            className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                        >
                        Read More
                        {/* <ArrowRightIcon className="w-4 h-4" /> */}
                        </Link>
                    </Button>
                    <div className="col-span-5 text-right">
                        <div className="flex flex-auto gap-0 text-sm leading-5">
                            <div className="flex-auto">
                                {blog?.author?.nickname} - Published on{' '}

                                {new Date(blog?.updateDate).getDate()}/
                                {new Date(blog?.updateDate).getMonth() < 9 ? '0' : ''}
                                {new Date(blog?.updateDate).getMonth() + 1}/
                                {new Date(blog?.updateDate).getFullYear()}
                            </div>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
