import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import classes from './createArticle.module.scss';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { ICreateArticleRequest, ICreateArticleFields, ICreateArticle } from '../../../Interfaces/interfaces';
import { useCreateArticleMutation } from '../../../API/api';

export const CreateArticle: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLogged);

  useEffect(() => {
    if (!Cookies.get('token')) {
      navigate('/authorization', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<ICreateArticleFields>({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tags: [{tag: ''}]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags', 
  });
  

  const [createArticle, { error }] = useCreateArticleMutation();

  const typedError = error as { status: number; data: { errors: Record<string, string> } };
  const getError = (fieldName: string) => {
    return typedError && typedError.data && typedError.data.errors
      ? typedError.data.errors[fieldName]
      : null;
  };

  const onSubmit: SubmitHandler<ICreateArticleFields> = (article) => {
    const tagsArray = article.tags.map(tag => tag.tag).filter(tag => tag.trim() !== '');
    const articleData = {
      article: {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: tagsArray
      },
    };

    createArticle(articleData)
      .unwrap()
      .then((payload) => {
        navigate('/articles', { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return  (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.header}>Create new article</div>
      <div className={classes.inputs}>
        <div className={classes.title}>Title
            <input 
            placeholder="Title"
            {...register('title', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters',
              },
            })} 
            />
            {errors?.title && <div className={classes.error}> {errors.title.message}</div> 
            || getError('title') && <div className={classes.error}> {`Title ${getError('title')}`}</div>}
            
            
        </div>
          <div className={classes.description}>Short description
            <input 
              placeholder="Description"
              {...register('description', {
              required: 'This field is required',

              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters',
              },
            })} 
            />
            {errors?.description && <div className={classes.error}> {errors.description.message}</div>
            || getError('email') && <div className={classes.error}> {`Description ${getError('description')}`}</div>}
        </div>
        
        <div className={classes.text}>Text
            <textarea 
            className={classes.body}
              placeholder="Text"
            
              {...register('body', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 4000,
                message: 'Maximum 4000 characters',
              },
            })}
            />
            {errors?.body && <div className={classes.error}> {errors.body.message}</div>
            || getError('body') && <div className={classes.error}> {`Text ${getError('body')}`}</div>}
        </div>
        <div className={classes.tags}>
        <label>Tags</label>
        {fields.map((item, index) => (
            <div className={classes.tagContainer} 
                  key={item.id}>
              <input
                className={classes.tag}
                {...register(`tags.${index}.tag` as const,{
                  minLength: {
                    value: 3,
                    message: 'Minimum 2 characters',
                  },
                  maxLength: {
                    value: 15,
                    message: 'Maximum 15 characters',
                  },
                })}
              />
              {errors?.tags && <div className={classes.error}> {errors.tags.message}</div>
                || getError('tags') && <div className={classes.error}> {`Tags ${getError('body')}`}</div>}
              <button 
                className={classes.delete}
                type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </div>
            ))}
            <button
            type="button"
            className={classes.add}
            onClick={() => append({tag:''})} // Добавляете пустую строку в массив tags
            >
            Add tag
            </button>
        </div>
        
        <input type='submit' value="Create" className={classes.submit}></input>
        
      </div>
    </form>
  )
};
