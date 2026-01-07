export interface ProfileRequest {
    image_url: string;
    description: string;
    main_skill: string;
    sub_skill: string;
    interest: string;
    note: string;
    motivation: string;
  }
  
  export interface ProfileResponse {
    message: string;
    data: {
      profile_id: number;
      user_id: number;
      image_url: string;
      description: string;
      main_skill: string;
      sub_skill: string;
      interest: string;
      note: string;
      motivation: string;
    };
  }