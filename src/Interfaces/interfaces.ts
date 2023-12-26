export interface IArticle {
    slug: string
    title: string
    description: string
    body: string
    tagList: string[]
    createdAt: string
    updatedAt: string
    favorited: boolean
    favoritesCount: number
    author: IAuthor
}

export interface IAuthor {
    username: string
    bio: string
    image: string
    following: boolean
}

export interface IArticlesResponse {
    articles: IArticle[]
    articlesCount: number
}
export interface IArticleResponse {
    article: IArticle
}

export interface IRegisterField{
    username: string
    email: string
    password: string
    repeatPassword: string
    terms: boolean
}
export interface ILoginField{
    email: string
    password: string
}

export interface IUserRegister{
    user: {
        username: string,
        email: string,
        password: string,
    }
}


export interface IUserLogIn {
    user: {
        email: string,
        password: string
    }
}

export interface IRegisterResponse{
    user: IResponseUser
}

export interface IResponseUser{
    email: string,
    token: string,
    username: string,
    bio: string,
    image: any,
}

export interface ISignInResponse{
    user: IResponseUser
}

export interface IEditProfileFields{
    username: string,
    email: string,
    password:string,
    bio: string,
    image: string,
}

export interface IEditProfileRequest{
    user: IEditProfileFields
}



export interface IEditProfileResponse{
    user: {
        username: string,
        email: string,
        password:string,
        bio: string,
        image: string,
        token: string,
    }
}


export interface ICreateArticleRequest{
    article: ICreateArticle
}
 export interface IEditArticleRequest {
    slug: string; 
    article: {
      title: string;
      description: string;
      body: string;
      tagList: string[]
    };
  }
  
export interface ICreateArticleFields{
    title: string,
    description: string,
    body: string,
    tags: {tag: string}[];
}

export interface ICreateArticle{
    title: string,
    description: string,
    body: string,
    tagList: string[];
}


export interface ICreateArticleResponse{     
    slug: string,
    title: string,
    description: string,
    body: string,
    tags: string[],
    createdAt: string,
    updatedAt: string,
    favorited: boolean,
    favoritesCount: number,
    author: {
        username: string,
        bio: string,
        image: string,
        following: boolean
    }   
}

