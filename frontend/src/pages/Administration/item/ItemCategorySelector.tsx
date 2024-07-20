import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { FormControl } from '@/components/ui/form.tsx';
import { Button } from '@/components/ui/button.tsx';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { SelectProps } from '@radix-ui/react-select';
import {
  createItemCategory,
  deleteItemCategory,
  getAllItemCategories,
  ItemCategoryRequestDTO,
} from '@/services/ItemCategoryService.ts';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ItemCategory } from '@/models/newModel/itemCategory.ts';
import { showErrorToast } from '@/lib/handle-error';

export default function ItemCategorySelector(props: SelectProps) {
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    getAllItemCategories(0, 50)
      .then((res) => {
        setCategories(res.data.content);
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  }, []);

  const createCategory = () => {
    let category: ItemCategoryRequestDTO = {
      itemCategoryId: -1,
      name: newCategory,
    };
    createItemCategory(category)
      .then((res) => {
        setCategories([...categories, res.data]);
        setNewCategory('');
        toast.success('Item category created', {
          position: 'bottom-right',
        });
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  };

  const deleteCategory = (id: number) => {
    deleteItemCategory(id)
      .then((res) => {
        setCategories(categories.filter((x) => x.itemCategoryId != id));
        toast.success('Item category deleted', {
          position: 'bottom-right',
        });
      })
      .catch((e) => {
        console.error(e);
        showErrorToast(e);
      });
  };

  return (
    <>
      <Select {...props}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {categories?.map((item) => (
            <div className="flex items-center justify-evenly" key={item.itemCategoryId}>
              <SelectItem className="w-9/12" value={item.itemCategoryId.toString()}>
                {item.name}
              </SelectItem>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1 w-2/12"
                onClick={() => deleteCategory(item.itemCategoryId)}
              >
                <MinusCircle className="h-full w-6" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-evenly ">
            <Input
              placeholder="Create new category"
              className="w-9/12"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button size="sm" variant="ghost" className="gap-1 w-2/12" onClick={createCategory}>
              <PlusCircle className="h-full w-6" />
            </Button>
          </div>
        </SelectContent>
      </Select>
    </>
  );
}
