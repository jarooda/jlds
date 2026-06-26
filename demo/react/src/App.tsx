import { useState } from 'react'

import { Accordion } from './components/ui/accordion'
import { Alert } from './components/ui/alert'
import { Avatar, AvatarGroup } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Banner } from './components/ui/banner'
import { Breadcrumb } from './components/ui/breadcrumb'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Checkbox } from './components/ui/checkbox'
import { Combobox } from './components/ui/combobox'
import { CommandPalette } from './components/ui/command-palette'
import { Dialog } from './components/ui/dialog'
import { Divider } from './components/ui/divider'
import { Drawer } from './components/ui/drawer'
import { DropdownMenu } from './components/ui/dropdown-menu'
import { EmptyState } from './components/ui/empty-state'
import { Field } from './components/ui/field'
import { IconButton } from './components/ui/icon-button'
import { Input } from './components/ui/input'
import { Kbd } from './components/ui/kbd'
import { NumberInput } from './components/ui/number-input'
import { Pagination } from './components/ui/pagination'
import { Popover } from './components/ui/popover'
import { Progress } from './components/ui/progress'
import { RadioGroup } from './components/ui/radio-group'
import { SegmentedControl } from './components/ui/segmented-control'
import { Select } from './components/ui/select'
import { Skeleton } from './components/ui/skeleton'
import { Slider } from './components/ui/slider'
import { Snippet } from './components/ui/snippet'
import { Spinner } from './components/ui/spinner'
import { Stat } from './components/ui/stat'
import { Stepper } from './components/ui/stepper'
import { Switch } from './components/ui/switch'
import { Table } from './components/ui/table'
import { Tabs } from './components/ui/tabs'
import { Tag } from './components/ui/tag'
import { Textarea } from './components/ui/textarea'
import { toast, Toaster } from './components/ui/toast'
import { Toggle, ToggleGroup } from './components/ui/toggle'
import { Tooltip } from './components/ui/tooltip'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  )
}

function App() {
  const [combo, setCombo] = useState<string | string[] | null>('apple')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [count, setCount] = useState<number | null>(2)
  const [page, setPage] = useState(1)
  const [radio, setRadio] = useState('one')
  const [segment, setSegment] = useState('list')
  const [slider, setSlider] = useState<number | [number, number]>(40)
  const [tab, setTab] = useState('overview')
  const [toggleOn, setToggleOn] = useState(false)
  const [toggleGroup, setToggleGroup] = useState<string | string[] | null>('left')

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1>JLDS Component Showcase</h1>

      <Section title="Button">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <IconButton aria-label="Settings">★</IconButton>
        <Toggle pressed={toggleOn} onPressedChange={setToggleOn}>
          Toggle
        </Toggle>
        <ToggleGroup
          aria-label="Alignment"
          value={toggleGroup}
          onChange={setToggleGroup}
          options={['left', 'center', 'right']}
        />
      </Section>

      <Section title="Badge / Tag / Kbd">
        <Badge color="success">New</Badge>
        <Badge color="danger" solid>
          Error
        </Badge>
        <Tag onRemove={() => {}}>Removable</Tag>
        <Kbd keys={['Cmd', 'K']} />
      </Section>

      <Section title="Feedback">
        <Spinner />
        <Progress value={60} showValue style={{ width: 200 }} />
        <Alert tone="info" title="Heads up">
          This is an informational alert.
        </Alert>
        <Banner tone="warning" title="Banner" onDismiss={() => {}}>
          A full-width announcement.
        </Banner>
      </Section>

      <Section title="Loading">
        <Skeleton variant="circle" width={48} height={48} />
        <Skeleton variant="text" lines={3} width={200} />
        <Skeleton variant="rect" width={120} height={64} />
      </Section>

      <Section title="Avatar">
        <Avatar name="Jalu Wibowo" status="online" />
        <AvatarGroup max={3}>
          <Avatar name="Ada Lovelace" />
          <Avatar name="Alan Turing" />
          <Avatar name="Grace Hopper" />
          <Avatar name="Linus Torvalds" />
        </AvatarGroup>
      </Section>

      <Section title="Form controls">
        <Field label="Email" hint="We never share it.">
          <Input placeholder="you@example.com" />
        </Field>
        <Field label="Bio">
          <Textarea placeholder="Tell us about yourself" />
        </Field>
        <NumberInput value={count ?? ''} onChange={setCount} min={0} max={10} />
        <Select
          placeholder="Pick one"
          options={[
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
          ]}
        />
        <Checkbox label="Accept terms" />
        <Switch label="Notifications" />
        <RadioGroup
          name="demo-radio"
          value={radio}
          onChange={setRadio}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
        <SegmentedControl
          aria-label="View"
          value={segment}
          onChange={setSegment}
          options={[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
        />
        <div style={{ width: 200 }}>
          <Slider value={slider} onChange={setSlider} />
        </div>
        <Combobox
          value={combo}
          onChange={setCombo}
          options={['apple', 'banana', 'cherry']}
        />
      </Section>

      <Section title="Navigation">
        <Breadcrumb
          items={[
            { label: 'Home', href: '#' },
            { label: 'Library', href: '#' },
            { label: 'Data', current: true },
          ]}
        />
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'overview', label: 'Overview' },
            { value: 'activity', label: 'Activity' },
          ]}
        />
        <Pagination page={page} pageCount={10} onChange={setPage} />
        <Stepper
          active={1}
          steps={[{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }]}
        />
      </Section>

      <Section title="Overlays">
        <DropdownMenu trigger={<Button>Menu</Button>}>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item tone="danger">Delete</DropdownMenu.Item>
        </DropdownMenu>
        <Popover trigger={<Button>Popover</Button>}>
          <div style={{ padding: 8 }}>Floating content</div>
        </Popover>
        <Tooltip content="A helpful hint">
          <Button>Hover me</Button>
        </Tooltip>
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
        <Button onClick={() => setPaletteOpen(true)}>Command palette</Button>
        <Button onClick={() => toast({ title: 'Saved', tone: 'success' })}>
          Toast
        </Button>
      </Section>

      <Section title="Data display">
        <Stat.Group>
          <Stat label="Revenue" value="$12.4k" delta="+12%" />
          <Stat label="Users" value="2,310" delta="-3%" />
        </Stat.Group>
        <Card style={{ width: 280 }}>
          <Card.Header title="Card title" subtitle="With subtitle" />
          <Card.Body>Body content goes here.</Card.Body>
          <Card.Footer>
            <Button size="sm">Action</Button>
          </Card.Footer>
        </Card>
        <Snippet code="npx jlds add button">npx jlds add button</Snippet>
        <Divider label="or" />
        <EmptyState
          title="Nothing here yet"
          description="Create your first item to get started."
          actions={<Button>Create</Button>}
        />
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell numeric>Count</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Alpha</Table.Cell>
              <Table.Cell numeric>42</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Beta</Table.Cell>
              <Table.Cell numeric>17</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Accordion type="single" defaultValue="a" style={{ width: 280 }}>
          <Accordion.Item value="a" title="Section one">
            First section content.
          </Accordion.Item>
          <Accordion.Item value="b" title="Section two">
            Second section content.
          </Accordion.Item>
        </Accordion>
      </Section>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Dialog title"
        description="A centered modal dialog."
        footer={<Button onClick={() => setDialogOpen(false)}>Close</Button>}
      >
        Dialog body content.
      </Dialog>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Drawer title"
      >
        Drawer body content.
      </Drawer>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={[
          { label: 'New file', group: 'File' },
          { label: 'Open settings', group: 'Navigation' },
        ]}
      />

      <Toaster />
    </main>
  )
}

export default App
