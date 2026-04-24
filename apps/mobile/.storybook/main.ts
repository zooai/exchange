import type { StorybookConfig } from '@storybook/react-native'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../node_modules/@l.x/ui/src/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../node_modules/@l.x/lx/src/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: ['@storybook/addon-ondevice-controls'],
}

export default config
