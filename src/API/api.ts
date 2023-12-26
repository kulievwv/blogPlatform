import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { IArticleResponse, 
        IEditArticleRequest, 
        IArticlesResponse, 
        ISignInResponse, 
        IUserRegister, 
        IRegisterResponse, 
        IUserLogIn, 
        IEditProfileRequest, 
        IEditProfileResponse, 
        ICreateArticleResponse, 
        ICreateArticleRequest } from '../Interfaces/interfaces';
import Cookies from 'js-cookie';

interface IArticlesQueryParams {
    limit: number;
    currentPage: number;
}

interface IArticleByIdParams {
    id: any
}


export const blogAPI = createApi({
    reducerPath: 'blogAPI',
    baseQuery: fetchBaseQuery({baseUrl: 'https://blog.kata.academy/api/'}),
    tagTypes: ['Post', 'Delete'],
    endpoints: (build) => ({
        getArticles: build.query<IArticlesResponse, IArticlesQueryParams>({
            query: ({ limit = 20, currentPage = 1 }) => {
                const offset = (currentPage - 1) * limit;
                return {
                    url: `/articles`,
                    params: {
                        limit,
                        offset
                    },
                    headers: {
                        Authorization: `Token ${Cookies.get('token')}`
                    },
                };
            },
            providesTags: result => ['Post', 'Delete']
        }),
        getArticleById: build.query<IArticleResponse, IArticleByIdParams>({
            query: ({id}) => ({
                url: `/articles/${id}`, 
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                },
            })
        }),
        signUp: build.mutation<IRegisterResponse, IUserRegister>({
            query: (user) => ({
                url: `/users`,
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['Post']
        }),
        logIn: build.mutation<ISignInResponse, IUserLogIn>({
            query: (user) => ({
                url: '/users/login',
                method: 'POST',
                body: user
            })
         }),
        getCurrentUserInfo: build.query<ISignInResponse, string>({
            query: (token) => ({
                url: '/user',
                headers: {
                    Authorization: `Token ${token}`
                }
            }),
         }),
        editProfile: build.mutation<IEditProfileResponse, IEditProfileRequest>({
            query: (body) => ({
                url: '/user',
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                },
                method: 'PUT',
                body: body

            })
         }),
        createArticle: build.mutation<ICreateArticleResponse, ICreateArticleRequest>({
            query: (body) => ({
                url: '/articles',
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                },
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Post']
         }),
        deleteArticle: build.mutation<void, string>({
            query: (slug) => ({
                url: `/articles/${slug}`,
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
                },
                method: 'DELETE',
            }),
            invalidatesTags: ['Delete']
         }),
        editArticle: build.mutation<IArticleResponse, IEditArticleRequest>({
            query: ({ slug, article }) => ({ 
              url: `/articles/${slug}`,
              method: 'PUT',
              headers: {
                Authorization: `Token ${Cookies.get('token')}`
              },
              body: {
                article 
              }
            }),
            invalidatesTags: ['Post']
          }),
        likeArticle: build.mutation<IArticleResponse, string>({
            query: (slug) => ({
                url: `/articles/${slug}/favorite`,
                method: 'POST',
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
              },
            }),
            invalidatesTags: ['Post']
          }),
        unlikeArticle: build.mutation<IArticleResponse, string>({
            query: (slug) => ({
                url: `/articles/${slug}/favorite`,
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${Cookies.get('token')}`
              },
            }),
            invalidatesTags: ['Delete']
          })
    })
})

export const {useGetArticlesQuery} = blogAPI;
export const {useGetArticleByIdQuery} = blogAPI;
export const {useSignUpMutation} = blogAPI;
export const {useLogInMutation} = blogAPI;
export const {useGetCurrentUserInfoQuery} = blogAPI;
export const {useEditProfileMutation} = blogAPI;
export const {useCreateArticleMutation} = blogAPI;
export const {useDeleteArticleMutation} = blogAPI;
export const {useEditArticleMutation} = blogAPI;
export const {useLikeArticleMutation} = blogAPI;
export const {useUnlikeArticleMutation} = blogAPI;
