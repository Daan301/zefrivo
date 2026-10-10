import {createCarousel} from './carousel.mjs?v=20261010-2';

const root=document.querySelector('[data-carousel]');
const section=document.querySelector('.flavor-section');
if(root && section) createCarousel(root,section);

const questions=[...document.querySelectorAll('.faq-list details')];
questions.forEach(question=>question.addEventListener('toggle',()=>{
  if(question.open) questions.forEach(other=>{if(other!==question)other.open=false;});
}));
