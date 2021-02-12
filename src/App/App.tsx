import { Box } from 'components'
import { Button } from 'components/Form'
import * as O from 'fp-ts/Option'
import * as S from 'lib/String'
import React from 'react'
import { AddText } from './AddText'
import './App.scss'
import { Trainer } from './Trainer'

type Tab = 'train' | 'add-text'

const App: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>('train')
  const [customText, setCustomText] = React.useState<O.Option<S.NonEmptyString>>(O.none)

  const handleAddText = (text: S.NonEmptyString): void => {
    setCustomText(O.of(text))
    setTab('train')
  }

  const resetCustomText = (): void => setCustomText(O.none)

  const handleTab = (tab: Tab) => (): void => setTab(tab)

  const renderTab = (): JSX.Element => {
    switch (tab) {
      case 'train':
        return <Trainer customText={customText} resetCustomText={resetCustomText} />
      case 'add-text':
        return <AddText handleAddText={handleAddText} />
    }
  }

  return (
    <Box alignItems='center' direction='column'>
      <Box alignItems='center' justifyContent='center' className='app__tabs mt-2'>
        <Button
          onClick={handleTab('train')}
          styling={tab === 'train' ? 'success' : 'primary'}
          type='button'>
          Train
        </Button>
        <Button
          onClick={handleTab('add-text')}
          styling={tab === 'add-text' ? 'success' : 'primary'}
          type='button'>
          Add custom text
        </Button>
      </Box>

      {renderTab()}
    </Box>
  )
}

export default App
