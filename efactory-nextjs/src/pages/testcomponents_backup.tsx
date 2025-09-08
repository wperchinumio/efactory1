import React, { useState, useEffect } from 'react';
import { IconSun, IconMoon, IconUser, IconMail, IconPhone, IconSettings } from '@tabler/icons-react';
import Button from '../components/ui/Button';
import CheckBox from '../components/ui/CheckBox';
import RadioButton from '../components/ui/RadioButton';
import SearchBox from '../components/ui/SearchBox';
import ComboList from '../components/ui/ComboList';
import MultiSelect from '../components/ui/MultiSelect';
import { GetStaticProps } from 'next';

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

  // Apply theme only (let global system handle dark/light mode)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Set theme
    html.setAttribute('data-luno-theme', currentTheme);
    body.setAttribute('data-luno-theme', currentTheme);
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
    <div className="min-h-screen bg-body-color" onMouseDownCapture={stopCheckboxHandlers}>
      {/* Header */}
      <div className="bg-card-color border-b border-border-color px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-font-color">Component Test Page</h1>
          <div className="flex items-center gap-4">
            {/* Theme Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-font-color">Theme:</label>
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className="px-3 py-1 bg-card-color border border-border-color rounded text-font-color text-sm"
              >
                {themes.map(theme => (
                  <option key={theme.value} value={theme.value}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
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
                  checked={checkboxStates.disabled}
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
  );
};

export default TestComponents;
< ! - -   p l - 1 0   - - >  
 