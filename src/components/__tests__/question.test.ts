import { mount } from '@vue/test-utils';
import { test, expect, describe } from 'vitest';
import Question from '../Question.vue';

const propItem = {
  id: 0,
  answers: ['7', '6', '5', '8'],
  category: 'Entertainment: Books',
  type: 'multiple',
  difficulty: 'medium',
  question: 'How many books are in the Chronicles of Narnia series?',
  correct_answer: '7',
  incorrect_answers: ['5', '6', '8'],
};

describe('Test question component', () => {
  test('Correct answer', async () => {
    expect(Question).toBeTruthy();

    const wrapper = mount(Question, {
      propsData: {
        item: propItem,
      },
    });
    const questionMessage = () => wrapper.find('.question__message');
    const button = () => wrapper.find('button');

    await button().trigger('click');

    expect(wrapper.emitted('answer')).toEqual([[true]]);
    expect(questionMessage().exists()).toBe(true);
    expect(wrapper.text()).toContain('Correct! Good job!');
  });

  test('Incrorrect answer', async () => {
    const wrapper = mount(Question, {
      props: {
        item: propItem,
      },
    });
    const questionMessage = () => wrapper.find('.question__message');
    const button = () => wrapper.find('button + button');

    await button().trigger('click');
    expect(wrapper.emitted('answer')).toEqual([[false]]);
    expect(questionMessage().exists()).toBe(true);
    expect(wrapper.text()).toContain("Wrong answer I'm afraid!");
  });
});
