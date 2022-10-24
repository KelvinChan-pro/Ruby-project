import styled from 'styled-components'; 

export const Button = styled.div` 
   position: fixed;
   width: 100%;
   left: 94%;
   bottom: 74px;
   height: 20px;
   font-size: 3rem;
   z-index: 1;
   cursor: pointer;
   color: #dee2e6;
   transition: all 0.25s ease;
   &::after{
      box-shadow: inset 0 0 0 1px $red;
   }
   &::before{
      background: $red; 
      box-shadow: inset 0 0 0 $icon-size $background;
   }
   &:hover::before{
      box-shadow: inset 0 0 0 1px $background;
   }
`