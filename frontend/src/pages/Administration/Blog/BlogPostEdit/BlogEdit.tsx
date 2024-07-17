import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation";
// import ProductPrice from "./ProductPrice";

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BlogPost } from "@/models/newModel/blogPost";
import BlogService from "@/services/BlogService";
import { getCookie } from "@/utils/cookies";
import BlogDetail from "./BlogDetail";
import BlogImageGallery from "./BlogImageGallery";
import BlogCategory from "./BlogCategory";
import { setCurrentBlogPost } from "@/redux/reducers/Blogs";
import { ConfirmationDialog } from "@/components/confirmation/confirmation-dialog";
import { showErrorToast } from "@/lib/handle-error";

const formSchema = z.object({
  categoryId: z.any({
    required_error: "Please select category to display.",
  }),
  userId: z.number(),
  title: z.string().min(5, {
    message: "Title must be at least 5 characters long.",
  }).max(200, {
    message: "Tile must not exceed 200 characters.",
  }),
  content: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }).max(100000, {
    message: "Description must not exceed 100000 characters.",
  }),
  files: z.any(),
  deletedFiles: z.any(),
})




export default function BlogEdit() {
  let blog = useAppSelector((state) => state.blogs.currentBlogPost);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const dispatch = useAppDispatch();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    },
  })
  useEffect(() => {
    if (!blog) {
      BlogService.getBlogById(parseInt(id)).then((res) => {
        blog = res.data;
        setCurrentBlog(blog);
        form.reset({
          categoryId: blog.category?.blogCategoryId,
          userId: JSON.parse(getCookie('user'))?.id || 0,
          title: blog.title,
          content: blog.content,
          files: [],
          deletedFiles: [],
        });
        console.log(blog);
      });

    } else {
      setCurrentBlog(blog);
      form.reset({
        categoryId: blog.category?.blogCategoryId,
        userId: JSON.parse(getCookie('user'))?.id || 0,
        title: blog.title,
        content: blog.content,
        files: [],
        deletedFiles: [],
      });
    }
  }, []);


  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // setIsLoading(true);
    // // Do something with the form values.
    // // ✅ This will be type-safe and validated.
    // console.log(values);
    // BlogService.updateBlog(blog?.postId || parseInt(id), values).then((res) => {
    //   console.log(form);
    //   console.log(res)
    //   BlogService.getBlogById(parseInt(id)).then((res) => {
    //     blog = res.data;
    //     setCurrentBlog(res.data);
    //   dispatch(setCurrentBlogPost(res.data));
    //   })
    //   toast.success('Blog updated successfully!', {
    //     position: "bottom-right",
    //   });
    //   form.reset({
    //     categoryId: res.data.category?.blogCategoryId,
    //     userId: JSON.parse(getCookie('user'))?.id || 0,
    //     title: res.data.title,
    //     content: res.data.content,
    //     files: [],
    //     deletedFiles: [],
    //   })

    //   values = form.getValues();
    //   console.log(form);
    //   console.log(values);
    //   setIsLoading(false);
    // }).catch((err) => {
    //   setIsLoading(false);
    //   if(err.response.status === 403){
    //     toast.error("You are not this blog author", {
    //       position: "bottom-right",
    //     });
    //     return;
    //   }

    //   toast.error(err.response.data.message, {
    //     position: "bottom-right",
    //   });
    // })
    setShowTrigger(true);
  }

  const handleConfirmed = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    BlogService.updateBlog(blog?.postId || parseInt(id), values).then((res) => {
      console.log(form);
      console.log(res)
      BlogService.getBlogById(parseInt(id)).then((res) => {
        blog = res.data;
        setCurrentBlog(res.data);
        dispatch(setCurrentBlogPost(res.data));
      })
      toast.success('Blog updated successfully!', {
        
      });
      form.reset({
        categoryId: res.data.category?.blogCategoryId,
        userId: JSON.parse(getCookie('user'))?.id || 0,
        title: res.data.title,
        content: res.data.content,
        files: [],
        deletedFiles: [],
      })

      values = form.getValues();
      console.log(form);
      console.log(values);
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
      showErrorToast(err);
      return;
    })
  }

  const confirm = () => {
    setIsConfirmed(true);
    setShowTrigger(false);
    setIsLoading(true);
  }

  useEffect(() => {
    if (isConfirmed) {
      if (form.getValues) {
        const values = form.getValues();
        handleConfirmed(values);
        setIsConfirmed(false);
      } else {
        setIsLoading(false)
      }
    }

  }, [isConfirmed, form.getValues])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {currentBlog === undefined || currentBlog === null
            ? <LoadingAnimation message="loading blog detail..." />
            : <div className="container flex flex-row flex-nowrap">

              <div className="basis-8/12 p-3 flex flex-col gap-3">
                <BlogDetail blog={currentBlog} title={currentBlog?.title} content={currentBlog?.content} form={form} />
                <BlogImageGallery images={currentBlog?.attachments} form={form} />
              </div>
              <div className="basis-4/12 p-3 flex flex-col gap-3">
                {isLoading
                  ? <Button type="submit" disabled>
                    <Loader2 className="animate-spin" />
                  </Button>
                  : <Button type="submit" >
                    Save
                  </Button>
                }
                <BlogCategory form={form} />
              </div>
            </div>
          }
        </form>
      </Form>
      <ConfirmationDialog
        description='This action cannot be undone.'
        label='Ok'
        message='Are you sure to Update this Blog?'
        onSuccess={confirm}
        open={showTrigger}
        onOpenChange={setShowTrigger}
        title='Confirmation'
      />
    </>
  );

}
