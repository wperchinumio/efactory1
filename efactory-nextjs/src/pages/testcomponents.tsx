import React, { useState, useEffect } from 'react';
import { IconSun, IconMoon, IconUser, IconMail, IconPhone, IconSettings } from '@tabler/icons-react';
import Button from '../components/ui/Button';
import CheckBox from '../components/ui/CheckBox';
import RadioButton from '../components/ui/RadioButton';
import SearchBox from '../components/ui/SearchBox';
import ComboList from '../components/ui/ComboList';
import MultiSelect from '../components/ui/MultiSelect';
import { GetStaticProps } from 'next';
import { ShadcnCheckbox as ScCheckbox, ShadcnLabel as ScLabel, ShadcnPopover as ScPopover, ShadcnPopoverTrigger as ScPopoverTrigger, ShadcnPopoverContent as ScPopoverContent, ShadcnCommand as ScCommand, ShadcnCommandInput as ScCommandInput, ShadcnCommandList as ScCommandList, ShadcnCommandEmpty as ScCommandEmpty, ShadcnCommandGroup as ScCommandGroup, ShadcnCommandItem as ScCommandItem, ShadcnScrollArea as ScScrollArea, ShadcnInput as ScInput, ShadcnTextarea as ScTextarea, ShadcnSelect as ScSelect, ShadcnSelectTrigger as ScSelectTrigger, ShadcnSelectContent as ScSelectContent, ShadcnSelectItem as ScSelectItem, ShadcnRadioGroup as ScRadioGroup, ShadcnRadioItem as ScRadioItem, ShadcnTabs as ScTabs, ShadcnTabsList as ScTabsList, ShadcnTabsTrigger as ScTabsTrigger, ShadcnTabsContent as ScTabsContent, ShadcnTooltip as ScTooltip, ShadcnTooltipProvider as ScTooltipProvider, ShadcnTooltipTrigger as ScTooltipTrigger, ShadcnTooltipContent as ScTooltipContent, ShadcnDropdown as ScDropdown, ShadcnDropdownTrigger as ScDropdownTrigger, ShadcnDropdownContent as ScDropdownContent, ShadcnDropdownItem as ScDropdownItem, ShadcnCard as ScCard, ShadcnCardHeader as ScCardHeader, ShadcnCardTitle as ScCardTitle, ShadcnCardContent as ScCardContent, ShadcnBadge as ScBadge, ShadcnCalendar as ScCalendar, ShadcnButton as ScButton } from '../components/shadcn';
import { getThemePreferences, saveThemePreferences, applyThemePreferences } from '@/lib/themeStorage';

const TestComponents = () => {
  const [currentTheme, setCurrentTheme] = useState('indigo');
  
  // Component states
  const [checkboxStates, setCheckboxStates] = useState({
    simple: false,
    withLabel: true,
    indeterminate: false,
    disabled: false,
    // Size demo states
    small: true,
    normal: true,
    large: true
  });
  
  const [radioValue, setRadioValue] = useState('option1');
  const [searchValue, setSearchValue] = useState('');
  const [comboValue, setComboValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [parityCompare, setParityCompare] = useState(false);
  const [showShadcn, setShowShadcn] = useState(true);
  const [activeTab, setActiveTab] = useState<'ours' | 'shadcn'>('ours');
  const [scComboOpen, setScComboOpen] = useState(false);
  const [scComboValue, setScComboValue] = useState<string>('');
  const scOptions = [
    { value: 'react', label: 'React' },
    { value: 'next', label: 'Next.js' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' }
  ];
  const currentYear = new Date().getFullYear();
  const [scCalMonth, setScCalMonth] = useState<Date>(new Date());
  const scMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Sample data
  const comboOptions = [
    { value: 'option1', label: 'Option 1', icon: IconUser },
    { value: 'option2', label: 'Option 2', icon: IconMail },
    { value: 'option3', label: 'Option 3', icon: IconPhone },
    { value: 'option4', label: 'Option 4', icon: IconSettings },
  ];

  const multiSelectOptions = [
    { value: 'item1', label: 'Item 1', icon: IconUser },
    { value: 'item2', label: 'Item 2', icon: IconMail },
    { value: 'item3', label: 'Item 3', icon: IconPhone },
    { value: 'item4', label: 'Item 4', icon: IconSettings },
    { value: 'item5', label: 'Item 5' },
    { value: 'item6', label: 'Item 6' },
  ];

  const themes = [
    { value: 'indigo', label: 'Indigo' },
    { value: 'blue', label: 'Blue' },
    { value: 'cyan', label: 'Cyan' },
    { value: 'green', label: 'Green' },
    { value: 'orange', label: 'Orange' },
    { value: 'blush', label: 'Blush' },
    { value: 'red', label: 'Red' },
  ];

  // Initialize theme from stored preferences
  useEffect(() => {
    const prefs = getThemePreferences();
    setCurrentTheme(prefs.lunoTheme);
  }, []);

  // Apply theme globally (same behavior as the app header)
  useEffect(() => {
    applyThemePreferences({
      mode: 'light',
      lunoTheme: currentTheme as any,
      rtlMode: false,
      fontFamily: 'Mulish, sans-serif',
      sidebarAutoCollapse: false,
      showTopMenuIcons: false
    });
    saveThemePreferences({ lunoTheme: currentTheme as any });
  }, [currentTheme]);

  // Only handle checkbox-specific event prevention
  useEffect(() => {
    const stopCheckboxHandlers = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Only prevent for checkbox elements, not all anchors
      if (target.closest('input[type="checkbox"], button[role="checkbox"]')) {
        e.stopPropagation();
      }
    };
    document.addEventListener('mousedown', stopCheckboxHandlers, true);
    return () => {
      document.removeEventListener('mousedown', stopCheckboxHandlers, true);
    };
  }, []);


  const ComponentSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-font-color mb-4 border-b border-border-color pb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  const ComponentDemo = ({ 
    title, 
    component, 
    code, 
    description 
  }: { 
    title: string; 
    component: React.ReactNode; 
    code: string;
    description?: string;
  }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 p-4 bg-card-color rounded-lg border border-border-color">
      <div>
        <h4 className="font-medium text-font-color mb-2">{title}</h4>
        {description && (
          <p className="text-sm text-font-color-100 mb-3">{description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {component}
        </div>
      </div>
      <div>
        <h4 className="font-medium text-font-color mb-2">Code</h4>
        <pre className="text-xs bg-body-color p-3 rounded border border-border-color overflow-x-auto">
          <code className="text-font-color">{code}</code>
        </pre>
      </div>
    </div>
  );

  const stopCheckboxHandlers = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    // Only prevent for checkbox elements
    if (target.closest('input[type="checkbox"], button[role="checkbox"]')) {
      e.stopPropagation();
    }
  };

  return (
    <div id="testcomponents-theme-root" className="min-h-screen bg-body-color" onMouseDownCapture={stopCheckboxHandlers}>
      {/* Header */}
      <div className="bg-card-color border-b border-border-color px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-font-color">Component Test Page</h1>
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-font-color">Theme:</label>
              <div className="flex flex-wrap gap-2">
                {themes.map(theme => (
                  <Button
                    key={theme.value}
                    size="small"
                    variant={currentTheme === theme.value ? 'primary' : 'outline'}
                    onClick={() => setCurrentTheme(theme.value)}
                  >
                    {theme.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex rounded-lg border border-border-color overflow-hidden">
            <button
              className={`px-4 py-2 text-sm ${activeTab === 'ours' ? 'bg-primary text-white' : 'bg-card-color text-font-color'}`}
              onClick={() => setActiveTab('ours')}
            >
              Our Components
            </button>
            <button
              className={`px-4 py-2 text-sm border-l border-border-color ${activeTab === 'shadcn' ? 'bg-primary text-white' : 'bg-card-color text-font-color'}`}
              onClick={() => setActiveTab('shadcn')}
            >
              Shadcn Components
            </button>
          </div>
        </div>
        {/* Our Components tab content */}
        <div hidden={activeTab !== 'ours'}>
        {/* Buttons */}
        <ComponentSection title="Buttons">
          <ComponentDemo
            title="Button Variants"
            description="Primary, Secondary, Outline, and Ghost adapt to theme colors. Danger, Success, and Warning use static colors."
            component={
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
              </div>
            }
            code={`// Theme-aware variants:
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Static color variants:
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>`}
          />

          <ComponentDemo
            title="Chart Color Variants"
            description="Buttons using the same color patterns as charts, adapting to theme changes"
            component={
              <div className="flex flex-wrap gap-3">
                <Button variant="chart" chartColor="chart1">Chart 1</Button>
                <Button variant="chart" chartColor="chart2">Chart 2</Button>
                <Button variant="chart" chartColor="chart3">Chart 3</Button>
                <Button variant="chart" chartColor="chart4">Chart 4</Button>
                <Button variant="chart" chartColor="chart5">Chart 5</Button>
              </div>
            }
            code={`<Button variant="chart" chartColor="chart1">Chart 1</Button>
<Button variant="chart" chartColor="chart2">Chart 2</Button>
<Button variant="chart" chartColor="chart3">Chart 3</Button>
<Button variant="chart" chartColor="chart4">Chart 4</Button>
<Button variant="chart" chartColor="chart5">Chart 5</Button>`}
          />

          <ComponentDemo
            title="Button Sizes"
            description="Small, normal, and large sizes with proper spacing"
            component={
              <div className="flex flex-wrap items-center gap-3">
                <Button size="small">Small</Button>
                <Button size="normal">Normal</Button>
                <Button size="large">Large</Button>
              </div>
            }
            code={`<Button size="small">Small</Button>
<Button size="normal">Normal</Button>
<Button size="large">Large</Button>`}
          />

          <ComponentDemo
            title="Button States"
            description="Normal, disabled, and loading states"
            component={
              <div className="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
              </div>
            }
            code={`<Button>Normal</Button>
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>`}
          />

          <ComponentDemo
            title="Button with Icons"
            description="Icons can be positioned left or right, or used as icon-only buttons"
            component={
              <div className="flex flex-wrap gap-3">
                <Button icon={<IconUser />} iconPosition="left">Left Icon</Button>
                <Button icon={<IconMail />} iconPosition="right">Right Icon</Button>
                <Button icon={<IconSettings />} iconOnly />
                <Button icon={<IconPhone />} iconOnly size="small" />
                <Button icon={<IconSun />} iconOnly size="large" />
              </div>
            }
            code={`<Button icon={<IconUser />} iconPosition="left">Left Icon</Button>
<Button icon={<IconMail />} iconPosition="right">Right Icon</Button>
<Button icon={<IconSettings />} iconOnly />
<Button icon={<IconPhone />} iconOnly size="small" />
<Button icon={<IconSun />} iconOnly size="large" />`}
          />

          <ComponentDemo
            title="Full Width Buttons"
            description="Buttons that span the full width of their container"
            component={
              <div className="w-full max-w-md space-y-3">
                <Button fullWidth>Full Width Primary</Button>
                <Button variant="outline" fullWidth>Full Width Outline</Button>
                <Button variant="ghost" fullWidth>Full Width Ghost</Button>
              </div>
            }
            code={`<Button fullWidth>Full Width Primary</Button>
<Button variant="outline" fullWidth>Full Width Outline</Button>
<Button variant="ghost" fullWidth>Full Width Ghost</Button>`}
          />

          <ComponentDemo
            title="Button Types"
            description="Different button types for forms"
            component={
              <div className="flex flex-wrap gap-3">
                <Button type="button">Button</Button>
                <Button type="submit">Submit</Button>
                <Button type="reset">Reset</Button>
              </div>
            }
            code={`<Button type="button">Button</Button>
<Button type="submit">Submit</Button>
<Button type="reset">Reset</Button>`}
          />
        </ComponentSection>

        {/* Our Components wrappers continue through all sections; close after MultiSelect below */}
        </div>

        {/* Shadcn tab content */}
        <div hidden={activeTab !== 'shadcn'}>
        <ComponentSection title="Shadcn (scoped)">
          <ComponentDemo
            title="Shadcn Showcase"
            description="Rendered inside .shadcn-scope so it doesn't affect the site theme."
            component={
              <div className="shadcn-scope">
                {/* Inputs */}
                <div className="flex flex-col gap-3 max-w-sm mb-6">
                  <ScLabel htmlFor="sc-input">Text input</ScLabel>
                  <ScInput id="sc-input" placeholder="Type here" />
                  <ScLabel htmlFor="sc-textarea">Textarea</ScLabel>
                  <ScTextarea id="sc-textarea" placeholder="Your notes..." />
                </div>

                {/* Combobox */}
                <div className="flex flex-col gap-3 max-w-sm mb-6">
                  <ScLabel htmlFor="sc-combobox">Framework</ScLabel>
                  <ScPopover open={scComboOpen} onOpenChange={setScComboOpen}>
                    <ScPopoverTrigger asChild>
                      <button className="px-3 py-2 rounded-md border border-border-color bg-card-color text-left">
                        {scOptions.find(o => o.value === scComboValue)?.label || 'Select...'}
                      </button>
                    </ScPopoverTrigger>
                    <ScPopoverContent className="p-0 w-[280px] bg-card-color text-font-color border border-border-color">
                      <ScCommand className="bg-card-color">
                        <ScCommandInput placeholder="Search framework..." />
                        <ScCommandEmpty>No results found.</ScCommandEmpty>
                        <ScCommandGroup>
                          <ScScrollArea className="max-h-[220px]">
                            {scOptions.map(o => (
                              <ScCommandItem key={o.value} value={o.label} onSelect={() => { setScComboValue(o.value); setScComboOpen(false); }}>
                                {o.label}
                              </ScCommandItem>
                            ))}
                          </ScScrollArea>
                        </ScCommandGroup>
                      </ScCommand>
                    </ScPopoverContent>
                  </ScPopover>
                </div>
                {/* Checkbox & Radio */}
                <div className="mt-4 flex items-center gap-6 mb-6">
                  <ScCheckbox id="sc1" />
                  <ScLabel htmlFor="sc1">Shadcn Checkbox</ScLabel>
                  <ScRadioGroup className="flex items-center gap-3" defaultValue="a">
                    <div className="flex items-center gap-1">
                      <ScRadioItem value="a" id="r1" />
                      <ScLabel htmlFor="r1">A</ScLabel>
                    </div>
                    <div className="flex items-center gap-1">
                      <ScRadioItem value="b" id="r2" />
                      <ScLabel htmlFor="r2">B</ScLabel>
                    </div>
                  </ScRadioGroup>
                </div>

                {/* Buttons & Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <ScButton>Primary</ScButton>
                  <ScBadge>Badge</ScBadge>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <ScTabs defaultValue="tab1" className="w-[300px]">
                    <ScTabsList>
                      <ScTabsTrigger value="tab1">Tab 1</ScTabsTrigger>
                      <ScTabsTrigger value="tab2">Tab 2</ScTabsTrigger>
                    </ScTabsList>
                    <ScTabsContent value="tab1">Content 1</ScTabsContent>
                    <ScTabsContent value="tab2">Content 2</ScTabsContent>
                  </ScTabs>
                </div>

                {/* Tooltip & Dropdown */}
                <ScTooltipProvider>
                  <div className="flex items-center gap-4 mb-6">
                    <ScTooltip>
                      <ScTooltipTrigger asChild>
                        <ScButton variant="outline">Hover me</ScButton>
                      </ScTooltipTrigger>
                      <ScTooltipContent>Tooltip text</ScTooltipContent>
                    </ScTooltip>

                    <ScDropdown>
                      <ScDropdownTrigger asChild>
                        <ScButton variant="outline">Menu</ScButton>
                      </ScDropdownTrigger>
                      <ScDropdownContent className="bg-card-color text-font-color border border-border-color">
                        <ScDropdownItem>Item 1</ScDropdownItem>
                        <ScDropdownItem>Item 2</ScDropdownItem>
                      </ScDropdownContent>
                    </ScDropdown>
                  </div>
                </ScTooltipProvider>

                {/* Calendar */}
                <div className="mb-6">
                  <ScCalendar
                    mode="single"
                    captionLayout="dropdown"
                    fromYear={currentYear - 10}
                    toYear={currentYear + 5}
                    showOutsideDays={true}
                    className="bg-card-color text-font-color border border-border-color rounded-md"
                  />
                </div>
              </div>
            }
            code={`<div className=\"shadcn-scope\">\n  <Input /> <Textarea />\n  <Popover>...Command...</Popover>\n  <Checkbox /> <RadioGroup />\n  <Button /> <Badge />\n  <Tabs />\n  <Tooltip /> <DropdownMenu />\n  <Calendar />\n</div>`}
          />
        </ComponentSection>
        </div>

        {/* Our Components: CheckBoxes */}
        <div hidden={activeTab !== 'ours'}>
        {/* CheckBoxes */}
        <ComponentSection title="CheckBoxes">
          <ComponentDemo
            title="CheckBox Variants"
            component={
              <>
                <CheckBox 
                  checked={checkboxStates.simple}
                  onChange={(checked) => {setCheckboxStates(prev => ({ ...prev, simple: checked }))}}
                  mode="emulated"
                />
                <CheckBox 
                  label="With Label"
                  checked={checkboxStates.withLabel}
                  onChange={(checked) => setCheckboxStates(prev => ({ ...prev, withLabel: checked }))}
                  mode="emulated"
                />
                <CheckBox 
                  label="Indeterminate"
                  indeterminate={true}
                  checked={checkboxStates.indeterminate}
                  onChange={(checked) => setCheckboxStates(prev => ({ ...prev, indeterminate: checked }))}
                  mode="emulated"
                />
                <CheckBox 
                  label="Disabled"
                  disabled={true}
                  checked={true}
                  mode="emulated"
                />
              </>
            }
            code={`<CheckBox checked={checked} onChange={setChecked} />
<CheckBox label="With Label" checked={checked} onChange={setChecked} />
<CheckBox label="Indeterminate" indeterminate={true} />
<CheckBox label="Disabled" disabled={true} />`}
          />

          <ComponentDemo
            title="CheckBox Sizes"
            component={
              <>
                <CheckBox 
                  size="small" 
                  label="Small" 
                  checked={checkboxStates.small}
                  onChange={(checked) => setCheckboxStates(prev => ({ ...prev, small: checked }))}
                  mode="emulated"
                />
                <CheckBox 
                  size="normal" 
                  label="Normal" 
                  checked={checkboxStates.normal}
                  onChange={(checked) => setCheckboxStates(prev => ({ ...prev, normal: checked }))}
                  mode="emulated"
                />
                <CheckBox 
                  size="large" 
                  label="Large" 
                  checked={checkboxStates.large}
                  onChange={(checked) => setCheckboxStates(prev => ({ ...prev, large: checked }))}
                  mode="emulated"
                />
              </>
            }
            code={`<CheckBox 
  size="small" 
  label="Small" 
  checked={checked}
  onChange={setChecked}
/>
<CheckBox 
  size="normal" 
  label="Normal" 
  checked={checked}
  onChange={setChecked}
/>
<CheckBox 
  size="large" 
  label="Large" 
  checked={checked}
  onChange={setChecked}
/>`}
          />
        </ComponentSection>

        {/* Admin parity: exact checkbox markup used on analytics pages */}
        <ComponentSection title="Checkbox (Admin parity)">
          <div className="bg-card-color border border-border-color rounded-lg p-4" onMouseDownCapture={(e) => e.stopPropagation()} onClickCapture={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[16px] font-bold text-font-color">Parity demo</h4>
              <div className='text-[12px] text-font-color-100'>This is the exact structure used in analytics pages.</div>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="compareYearsParity"
                className="form-check-input"
                checked={parityCompare}
                onChange={(e) => setParityCompare(e.target.checked)}
              />
              <label htmlFor="compareYearsParity" className="form-check-label text-xs text-font-color-100">
                Compare to previous 2 years (parity)
              </label>
            </div>
          </div>
        </ComponentSection>

        {/* Radio Buttons */}
        <ComponentSection title="Radio Buttons">
          <ComponentDemo
            title="Radio Button Group"
            component={
              <>
                <RadioButton
                  name="radio-group"
                  value="option1"
                  label="Option 1"
                  checked={radioValue === 'option1'}
                  onChange={setRadioValue}
                />
                <RadioButton
                  name="radio-group"
                  value="option2"
                  label="Option 2"
                  checked={radioValue === 'option2'}
                  onChange={setRadioValue}
                />
                <RadioButton
                  name="radio-group"
                  value="option3"
                  label="Option 3"
                  checked={radioValue === 'option3'}
                  onChange={setRadioValue}
                />
                <RadioButton
                  name="radio-group"
                  value="disabled"
                  label="Disabled"
                  disabled={true}
                  checked={false}
                  onChange={setRadioValue}
                />
              </>
            }
            code={`<RadioButton
  name="radio-group"
  value="option1"
  label="Option 1"
  checked={radioValue === 'option1'}
  onChange={setRadioValue}
/>`}
          />

          <ComponentDemo
            title="Radio Button Sizes"
            component={
              <>
                <RadioButton name="size-group" value="small" label="Small" size="small" checked={true} onChange={() => {}} />
                <RadioButton name="size-group" value="normal" label="Normal" size="normal" checked={true} onChange={() => {}} />
                <RadioButton name="size-group" value="large" label="Large" size="large" checked={true} onChange={() => {}} />
              </>
            }
            code={`<RadioButton size="small" label="Small" />
<RadioButton size="normal" label="Normal" />
<RadioButton size="large" label="Large" />`}
          />
        </ComponentSection>

        {/* Search Box */}
        <ComponentSection title="Search Box">
          <ComponentDemo
            title="Search Box Variants"
            component={
              <div className="w-full max-w-md space-y-4">
                <SearchBox
                  placeholder="Search..."
                />
                <SearchBox
                  placeholder="No clear button"
                  showClearButton={false}
                />
                <SearchBox
                  placeholder="Disabled"
                  disabled={true}
                />
              </div>
            }
            code={`<SearchBox
  value={searchValue}
  onChange={setSearchValue}
  placeholder="Search..."
/>
<SearchBox showClearButton={false} />
<SearchBox disabled={true} />`}
          />

          <ComponentDemo
            title="Search Box Sizes"
            component={
              <div className="w-full max-w-md space-y-4">
                <SearchBox size="small" placeholder="Small search..." />
                <SearchBox size="normal" placeholder="Normal search..." />
                <SearchBox size="large" placeholder="Large search..." />
              </div>
            }
            code={`<SearchBox size="small" placeholder="Small search..." />
<SearchBox size="normal" placeholder="Normal search..." />
<SearchBox size="large" placeholder="Large search..." />`}
          />
        </ComponentSection>

        {/* ComboList */}
        <ComponentSection title="ComboList">
          <ComponentDemo
            title="ComboList Variants"
            component={
              <div className="w-full max-w-md space-y-4">
                <ComboList
                  value={comboValue}
                  onValueChange={setComboValue}
                  options={comboOptions}
                  placeholder="Select an option..."
                />
                <ComboList
                  options={comboOptions}
                  placeholder="Without search"
                  showSearch={false}
                  onValueChange={() => {}}
                />
                <ComboList
                  options={comboOptions}
                  placeholder="Clearable"
                  clearable={true}
                  onValueChange={() => {}}
                />
              </div>
            }
            code={`<ComboList
  value={value}
  onValueChange={setValue}
  options={options}
  placeholder="Select an option..."
/>
<ComboList showSearch={false} />
<ComboList clearable={true} />`}
          />

          <ComponentDemo
            title="ComboList Sizes"
            component={
              <div className="w-full max-w-md space-y-4">
                <ComboList size="small" options={comboOptions} placeholder="Small" onValueChange={() => {}} />
                <ComboList size="normal" options={comboOptions} placeholder="Normal" onValueChange={() => {}} />
                <ComboList size="large" options={comboOptions} placeholder="Large" onValueChange={() => {}} />
              </div>
            }
            code={`<ComboList size="small" options={options} />
<ComboList size="normal" options={options} />
<ComboList size="large" options={options} />`}
          />
        </ComponentSection>

        {/* MultiSelect */}
        <ComponentSection title="MultiSelect">
          <ComponentDemo
            title="MultiSelect Variants"
            component={
              <div className="w-full max-w-md space-y-4">
                <MultiSelect
                  value={multiSelectValue}
                  onValueChange={setMultiSelectValue}
                  options={multiSelectOptions}
                  placeholder="Select multiple options..."
                />
                <MultiSelect
                  value={multiSelectValue}
                  onValueChange={setMultiSelectValue}
                  options={multiSelectOptions}
                  placeholder="Select with Apply..."
                  applyMode={true}
                />
                <MultiSelect
                  options={multiSelectOptions}
                  placeholder="Without checkboxes"
                  showCheckboxes={false}
                  onValueChange={() => {}}
                />
                <MultiSelect
                  options={multiSelectOptions}
                  placeholder="Without search"
                  showSearch={false}
                  onValueChange={() => {}}
                />
              </div>
            }
            code={`<MultiSelect
  value={value}
  onValueChange={setValue}
  options={options}
  placeholder="Select multiple options..."
/>
<MultiSelect showCheckboxes={false} />
<MultiSelect showSearch={false} />`}
          />

          <ComponentDemo
            title="MultiSelect Sizes"
            component={
              <div className="w-full max-w-md space-y-4">
                <MultiSelect size="small" options={multiSelectOptions} placeholder="Small" onValueChange={() => {}} />
                <MultiSelect size="normal" options={multiSelectOptions} placeholder="Normal" onValueChange={() => {}} />
                <MultiSelect size="large" options={multiSelectOptions} placeholder="Large" onValueChange={() => {}} />
              </div>
            }
            code={`<MultiSelect size="small" options={options} />
<MultiSelect size="normal" options={options} />
<MultiSelect size="large" options={options} />`}
          />
        </ComponentSection>
        </div>
      </div>
    </div>
  );
};

export default TestComponents;