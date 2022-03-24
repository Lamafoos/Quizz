import { mount } from '@vue/test-utils';
import { test, expect, describe, fn } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import GameSummary from '@/components/GameSummary.vue';

describe('GameSummarycomponent', () => {
  test('test show modal', async () => {
    const wrapper = mount(GameSummary, {
      global: {
        stubs: { teleport: true },
        plugins: [
          createTestingPinia({
            createSpy: fn,
          }),
        ],
      },
    });
    const button = () => wrapper.find('button');
    await button().trigger('click');

    expect(wrapper.find('.game-summary').exists()).toBe(true);
  });
});
