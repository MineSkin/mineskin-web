export interface BasicCreditInfo {
   all:{
       balance: number;
       total: number;
   };
   current: {
       type: string;
       balance: number;
       total: number;
   };
}