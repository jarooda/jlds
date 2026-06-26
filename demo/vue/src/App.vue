<script setup lang="ts">
import { ref } from 'vue'

import { Accordion, AccordionItem } from './components/ui/accordion'
import { Alert } from './components/ui/alert'
import { Avatar, AvatarGroup } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Banner } from './components/ui/banner'
import { Breadcrumb } from './components/ui/breadcrumb'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardBody, CardFooter } from './components/ui/card'
import { Checkbox } from './components/ui/checkbox'
import { Combobox } from './components/ui/combobox'
import { CommandPalette } from './components/ui/command-palette'
import { Dialog } from './components/ui/dialog'
import { Divider } from './components/ui/divider'
import { Drawer } from './components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './components/ui/dropdown-menu'
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
import { Stat, StatGroup } from './components/ui/stat'
import { Stepper } from './components/ui/stepper'
import { Switch } from './components/ui/switch'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from './components/ui/table'
import { Tabs } from './components/ui/tabs'
import { Tag } from './components/ui/tag'
import { Textarea } from './components/ui/textarea'
import { Toaster, toast } from './components/ui/toast'
import { Toggle, ToggleGroup } from './components/ui/toggle'
import { Tooltip } from './components/ui/tooltip'

const inputVal = ref('')
const textareaVal = ref('')
const selectVal = ref('')
const checkboxVal = ref(false)
const switchVal = ref(false)
const numberVal = ref<number | null>(2)
const radioVal = ref('one')
const segmentVal = ref('list')
const sliderVal = ref<number | [number, number]>(40)
const comboVal = ref<string | string[] | null>('apple')
const tabVal = ref('overview')
const page = ref(1)
const togglePressed = ref(false)
const toggleGroupVal = ref<string | string[] | null>('left')

const dialogOpen = ref(false)
const drawerOpen = ref(false)
const paletteOpen = ref(false)

const breadcrumbItems = [
  { label: 'Home', href: '#' },
  { label: 'Library', href: '#' },
  { label: 'Data', current: true },
]
const tabItems = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
]
const stepperSteps = [{ label: 'Cart' }, { label: 'Shipping' }, { label: 'Payment' }]
const selectOptions = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
]
const radioOptions = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
]
const segmentOptions = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
]
const comboOptions = ['apple', 'banana', 'cherry']
const paletteItems = [
  { label: 'New file', group: 'File' },
  { label: 'Open settings', group: 'Navigation' },
]
</script>

<template>
  <main style="max-width: 960px; margin: 0 auto; padding: 24px">
    <h1>JLDS Component Showcase</h1>

    <section>
      <h2>Button</h2>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <IconButton aria-label="Settings">★</IconButton>
      <Toggle v-model:pressed="togglePressed">Toggle</Toggle>
      <ToggleGroup v-model="toggleGroupVal" :options="['left', 'center', 'right']" />
    </section>

    <section>
      <h2>Badge / Tag / Kbd</h2>
      <Badge color="success">New</Badge>
      <Badge color="danger" solid>Error</Badge>
      <Tag removable>Removable</Tag>
      <Kbd :keys="['Cmd', 'K']" />
    </section>

    <section>
      <h2>Feedback</h2>
      <Spinner />
      <Progress :value="60" show-value />
      <Alert tone="info" title="Heads up">This is an informational alert.</Alert>
      <Banner tone="warning" title="Banner">A full-width announcement.</Banner>
    </section>

    <section>
      <h2>Loading</h2>
      <Skeleton variant="circle" :width="48" :height="48" />
      <Skeleton variant="text" :lines="3" :width="200" />
      <Skeleton variant="rect" :width="120" :height="64" />
    </section>

    <section>
      <h2>Avatar</h2>
      <Avatar name="Jalu Wibowo" status="online" />
      <AvatarGroup :max="3">
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Linus Torvalds" />
      </AvatarGroup>
    </section>

    <section>
      <h2>Form controls</h2>
      <Field label="Email" hint="We never share it.">
        <Input v-model="inputVal" placeholder="you@example.com" />
      </Field>
      <Field label="Bio">
        <Textarea v-model="textareaVal" placeholder="Tell us about yourself" />
      </Field>
      <NumberInput v-model="numberVal" :min="0" :max="10" />
      <Select v-model="selectVal" placeholder="Pick one" :options="selectOptions" />
      <Checkbox v-model="checkboxVal" label="Accept terms" />
      <Switch v-model="switchVal" label="Notifications" />
      <RadioGroup v-model="radioVal" name="demo-radio" :options="radioOptions" />
      <SegmentedControl v-model="segmentVal" :options="segmentOptions" />
      <div style="width: 200px">
        <Slider v-model="sliderVal" />
      </div>
      <Combobox v-model="comboVal" :options="comboOptions" />
    </section>

    <section>
      <h2>Navigation</h2>
      <Breadcrumb :items="breadcrumbItems" />
      <Tabs v-model="tabVal" :items="tabItems" />
      <Pagination v-model:page="page" :page-count="10" />
      <Stepper :steps="stepperSteps" :active="1" />
    </section>

    <section>
      <h2>Overlays</h2>
      <DropdownMenu>
        <template #trigger>
          <Button>Menu</Button>
        </template>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
      </DropdownMenu>
      <Popover>
        <template #trigger>
          <Button>Popover</Button>
        </template>
        <div style="padding: 8px">Floating content</div>
      </Popover>
      <Tooltip content="A helpful hint">
        <Button>Hover me</Button>
      </Tooltip>
      <Button @click="dialogOpen = true">Open dialog</Button>
      <Button @click="drawerOpen = true">Open drawer</Button>
      <Button @click="paletteOpen = true">Command palette</Button>
      <Button @click="toast({ title: 'Saved', tone: 'success' })">Toast</Button>
    </section>

    <section>
      <h2>Data display</h2>
      <StatGroup>
        <Stat label="Revenue" value="$12.4k" delta="+12%" />
        <Stat label="Users" value="2,310" delta="-3%" />
      </StatGroup>
      <Card style="width: 280px">
        <CardHeader title="Card title" subtitle="With subtitle" />
        <CardBody>Body content goes here.</CardBody>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
      <Snippet code="npx jlds add button">npx jlds add button</Snippet>
      <Divider label="or" />
      <EmptyState
        title="Nothing here yet"
        description="Create your first item to get started."
      >
        <Button>Create</Button>
      </EmptyState>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell numeric>Count</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Alpha</TableCell>
            <TableCell numeric>42</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Beta</TableCell>
            <TableCell numeric>17</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Accordion type="single" default-value="a" style="width: 280px">
        <AccordionItem value="a" title="Section one">First section content.</AccordionItem>
        <AccordionItem value="b" title="Section two">Second section content.</AccordionItem>
      </Accordion>
    </section>

    <Dialog
      v-model:open="dialogOpen"
      title="Dialog title"
      description="A centered modal dialog."
    >
      Dialog body content.
    </Dialog>

    <Drawer v-model:open="drawerOpen" title="Drawer title">Drawer body content.</Drawer>

    <CommandPalette v-model:open="paletteOpen" :items="paletteItems" />

    <Toaster />
  </main>
</template>
