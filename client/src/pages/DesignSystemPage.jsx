import React, { useState } from 'react';
import {
  Button,
  IconButton,
  TextField,
  PasswordField,
  Select,
  Checkbox,
  Radio,
  Badge,
  StatusBadge,
  FoodTypeIndicator,
  Spinner,
  Skeleton,
  Modal,
  Drawer,
  PageContainer,
  PageHeader,
  EmptyState,
  useToast
} from '../components/ui';
import {
  Sparkles,
  ShoppingBag,
  Search,
  Mail,
  User,
  Heart,
  Trash2,
  Edit2,
  Clock,
  ArrowRight,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Palette,
  Type,
  Sliders,
  Bell
} from 'lucide-react';

export const DesignSystemPage = () => {
  const toast = useToast();

  // Interactive component states
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('breakfast');
  const [buttonLoading, setButtonLoading] = useState(false);

  // Trigger button loading simulation
  const handleLoadingDemo = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      toast.success('Action simulated successfully!');
    }, 1500);
  };

  return (
    <PageContainer size="standard" paddingY="lg">
      {/* Top Header */}
      <PageHeader
        eyebrow="CampusBite UI Architecture"
        title="Design System & Foundations Lab"
        description="The unified visual vocabulary, design tokens, typography scale, form primitives, and layout foundation for CampusBite."
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              iconBefore={<Bell size={15} />}
              onClick={() => toast.info('Design System version 2.0 active')}
            >
              System Status: Active
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconBefore={<Sparkles size={15} />}
              onClick={() => toast.success('All design foundation tokens verified!')}
            >
              Verify Tokens
            </Button>
          </div>
        }
      />

      {/* Section 1: Brand Colors & Tonal Scales */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Palette size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">1. Color System & Semantic Tokens</h2>
        </div>

        {/* Primary Brand Orange */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>
            Brand Primary — Warm Amber Orange (#e65100)
          </h4>
          <p className="type-body-sm" style={{ marginBottom: '1rem' }}>
            Used for primary actions, active tabs, highlights, and brand identity. Never overwhelmed across entire backgrounds.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
            {[
              { token: '50', hex: '#fff8f1', bg: 'var(--brand-50)', text: '#191d24' },
              { token: '100', hex: '#feecd6', bg: 'var(--brand-100)', text: '#191d24' },
              { token: '200', hex: '#fdd4aa', bg: 'var(--brand-200)', text: '#191d24' },
              { token: '300', hex: '#fbb373', bg: 'var(--brand-300)', text: '#191d24' },
              { token: '400', hex: '#f88b39', bg: 'var(--brand-400)', text: '#ffffff' },
              { token: '500', hex: '#e65100', bg: 'var(--brand-500)', text: '#ffffff', isMain: true },
              { token: '600', hex: '#c64200', bg: 'var(--brand-600)', text: '#ffffff' },
              { token: '700', hex: '#a33400', bg: 'var(--brand-700)', text: '#ffffff' },
              { token: '800', hex: '#812a03', bg: 'var(--brand-800)', text: '#ffffff' },
              { token: '900', hex: '#682406', bg: 'var(--brand-900)', text: '#ffffff' },
              { token: '950', hex: '#381001', bg: 'var(--brand-950)', text: '#ffffff' }
            ].map((c) => (
              <div
                key={c.token}
                style={{
                  backgroundColor: c.bg,
                  color: c.text,
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  border: c.isMain ? '2px solid #191d24' : '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ fontWeight: 800 }}>{c.token}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: '2px' }}>{c.hex}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charcoal Slate Neutrals */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>
            Slate Neutrals & Secondary Palette (#272d3b)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.5rem' }}>
            {[
              { token: '50', hex: '#f8f9fa', bg: 'var(--slate-50)', text: '#191d24' },
              { token: '100', hex: '#f1f3f5', bg: 'var(--slate-100)', text: '#191d24' },
              { token: '200', hex: '#e5e7eb', bg: 'var(--slate-200)', text: '#191d24' },
              { token: '300', hex: '#d1d5db', bg: 'var(--slate-300)', text: '#191d24' },
              { token: '400', hex: '#9ca3af', bg: 'var(--slate-400)', text: '#ffffff' },
              { token: '500', hex: '#6b7280', bg: 'var(--slate-500)', text: '#ffffff' },
              { token: '600', hex: '#4b5563', bg: 'var(--slate-600)', text: '#ffffff' },
              { token: '700', hex: '#374151', bg: 'var(--slate-700)', text: '#ffffff' },
              { token: '800', hex: '#272d3b', bg: 'var(--slate-800)', text: '#ffffff', isMain: true },
              { token: '900', hex: '#1b1f2b', bg: 'var(--slate-900)', text: '#ffffff' }
            ].map((c) => (
              <div
                key={c.token}
                style={{
                  backgroundColor: c.bg,
                  color: c.text,
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  border: c.isMain ? '2px solid var(--color-brand-primary)' : '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ fontWeight: 800 }}>{c.token}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: '2px' }}>{c.hex}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Surfaces, Dietary, and Feedback Colors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 className="type-h4" style={{ marginBottom: '0.5rem' }}>Surfaces & Canvas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', backgroundColor: 'var(--color-canvas)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span>--color-canvas</span>
                <span style={{ fontFamily: 'monospace' }}>#f8f6f2</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span>--color-surface</span>
                <span style={{ fontFamily: 'monospace' }}>#ffffff</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span>--color-surface-subtle</span>
                <span style={{ fontFamily: 'monospace' }}>#f1ede6</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 className="type-h4" style={{ marginBottom: '0.5rem' }}>Dietary Semantics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', backgroundColor: 'var(--color-veg-bg)', color: 'var(--color-veg)', borderRadius: '4px', border: '1px solid var(--color-veg-border)', fontWeight: 600 }}>
                <span>Pure Veg</span>
                <span style={{ fontFamily: 'monospace' }}>#2e7d32</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem', backgroundColor: 'var(--color-nonveg-bg)', color: 'var(--color-nonveg)', borderRadius: '4px', border: '1px solid var(--color-nonveg-border)', fontWeight: 600 }}>
                <span>Non-Veg</span>
                <span style={{ fontFamily: 'monospace' }}>#c62828</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Typography Scale */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Type size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">2. Typography Scale & Hierarchy</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Display Hero (2.75rem / 44px - Outfit 800)</span>
            <div className="type-display">Fresh Food Without The Wait</div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          <div>
            <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Page Title H1 (2.15rem / 34px - Outfit 800)</span>
            <h1 className="type-h1">Campus Canteen Menu</h1>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          <div>
            <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Section Title H2 (1.65rem / 26px - Outfit 700)</span>
            <h2 className="type-h2">Popular Lunch Specials Today</h2>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          <div>
            <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Card Title H3 (1.25rem / 20px - Outfit 700)</span>
            <h3 className="type-h3">Royal Veg Biryani with Mirchi Salan</h3>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          <div>
            <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Body Large (1.05rem / 17px - Plus Jakarta Sans 400)</span>
            <p className="type-body-lg">
              Pre-order during class lectures and pick up your hot, freshly packaged tray in under 60 seconds at Counter #3.
            </p>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          <div>
            <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Body Regular (0.925rem / 15px - Plus Jakarta Sans 400)</span>
            <p className="type-body">
              All meals are prepared fresh in the central kitchen with verified college hygiene certification.
            </p>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Specialized Tokens: Price & Pickup Token */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Price Formatting (Tabular Figures)</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.25rem' }}>
                <span className="type-price">₹120</span>
                <span className="type-price-lg">₹480.00</span>
              </div>
            </div>

            <div>
              <span className="type-label" style={{ color: 'var(--color-text-muted)' }}>Campus Pickup Token Display (Space Mono)</span>
              <div style={{ marginTop: '0.25rem' }}>
                <span className="token-display">CB-1042</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Buttons & Interactive Controls */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sliders size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">3. Button Primitives & Interactive States</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 className="type-h4" style={{ marginBottom: '1rem' }}>Variants & Sizes</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Button variant="primary" size="lg">Primary Large</Button>
            <Button variant="primary" size="md">Primary Medium</Button>
            <Button variant="primary" size="sm">Primary Small</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="outline" size="md">Tertiary / Outline</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="danger" size="md">Danger</Button>
          </div>

          <h4 className="type-h4" style={{ marginBottom: '1rem' }}>With Icons & Dynamic States</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Button
              variant="primary"
              iconBefore={<ShoppingBag size={17} />}
              onClick={() => toast.success('Added Royal Biryani to tray!')}
            >
              Add to Tray
            </Button>
            <Button
              variant="secondary"
              iconAfter={<ArrowRight size={17} />}
              onClick={() => toast.info('Navigating to checkout...')}
            >
              Checkout Now
            </Button>
            <Button
              variant="primary"
              loading={buttonLoading}
              onClick={handleLoadingDemo}
            >
              {buttonLoading ? 'Placing Order...' : 'Click to Simulate Loading'}
            </Button>
            <Button variant="primary" disabled>
              Disabled Button
            </Button>
          </div>

          <h4 className="type-h4" style={{ marginBottom: '1rem' }}>Dedicated Icon Buttons</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <IconButton
              icon={<Heart size={18} />}
              aria-label="Add to favorites"
              variant="outline"
              size="md"
              onClick={() => toast.success('Added to favorites')}
            />
            <IconButton
              icon={<Edit2 size={18} />}
              aria-label="Edit item"
              variant="ghost"
              size="md"
              onClick={() => toast.info('Edit mode enabled')}
            />
            <IconButton
              icon={<Trash2 size={18} />}
              aria-label="Remove item"
              variant="danger"
              size="md"
              onClick={() => toast.error('Item removed from tray')}
            />
            <IconButton
              icon={<ShoppingBag size={18} />}
              aria-label="Cart"
              variant="primary"
              size="lg"
              shape="circle"
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* Section 4: Form Primitives */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Layers size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">4. Form Primitives & Validation States</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <TextField
              label="Student Name"
              placeholder="e.g. Aditi Sharma"
              leadingIcon={<User size={18} />}
              helper="Enter your full official college name."
              required
            />

            <TextField
              label="Campus Email"
              type="email"
              placeholder="student@college.edu"
              leadingIcon={<Mail size={18} />}
              required
            />

            <PasswordField
              label="Account Password"
              placeholder="Enter secure password"
              helper="Must contain at least 6 characters."
              required
            />

            <TextField
              label="Invalid Field Demo"
              defaultValue="invalid-token#123"
              error="The pickup token format must match CB-XXXX."
            />

            <Select
              label="Pickup Counter"
              placeholder="Select preferred pickup station"
              options={[
                { value: 'counter_1', label: 'Counter #1 — Main Food Court' },
                { value: 'counter_2', label: 'Counter #2 — Library Express Kiosk' },
                { value: 'counter_3', label: 'Counter #3 — Amenities Complex' }
              ]}
              defaultValue="counter_3"
              helper="Select nearest counter to your classroom."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
              <span className="form-label">Options & Preferences</span>
              <Checkbox
                label="Send SMS notification when food is ready"
                description="Receive an instant ping with token CB-XXXX."
                checked={checkboxVal}
                onChange={(e) => setCheckboxVal(e.target.checked)}
              />
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem' }}>
                <Radio
                  name="meal_type"
                  value="breakfast"
                  label="Morning Slot"
                  checked={radioVal === 'breakfast'}
                  onChange={(e) => setRadioVal(e.target.value)}
                />
                <Radio
                  name="meal_type"
                  value="lunch"
                  label="Lunch Slot"
                  checked={radioVal === 'lunch'}
                  onChange={(e) => setRadioVal(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Badges, Status & Food Type Indicators */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">5. Badges, Dietary & Status Indicators</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dietary Indicators */}
          <div>
            <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>Food Type Indicators (Authentic Veg / Non-Veg Geometry)</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              <FoodTypeIndicator isVeg={true} showLabel={true} />
              <FoodTypeIndicator isVeg={false} showLabel={true} />
              <FoodTypeIndicator isVeg={true} size="lg" showLabel={true} />
              <FoodTypeIndicator isVeg={false} size="lg" showLabel={true} />
              <FoodTypeIndicator isVeg={true} size="sm" showLabel={false} />
              <FoodTypeIndicator isVeg={false} size="sm" showLabel={false} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Status Badges */}
          <div>
            <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>Universal Order Status Badges</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <StatusBadge status="pending" />
              <StatusBadge status="preparing" />
              <StatusBadge status="ready" />
              <StatusBadge status="completed" />
              <StatusBadge status="cancelled" />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* General Badges */}
          <div>
            <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>General Semantic Badges</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <Badge variant="brand">Chef's Special</Badge>
              <Badge variant="success">Express 5 Mins</Badge>
              <Badge variant="warning">Low Stock</Badge>
              <Badge variant="danger">Sold Out</Badge>
              <Badge variant="info">Student Discount</Badge>
              <Badge variant="neutral">Counter #3</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Feedback, Loaders & Overlays */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Bell size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">6. Feedback, Loaders & Overlay Primitives</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Toast Notification Triggers */}
          <div>
            <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>Interactive Toast Notification System</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Button
                variant="outline"
                size="sm"
                iconBefore={<CheckCircle2 size={16} color="var(--color-success)" />}
                onClick={() => toast.success('Your meal is ready for pickup at Counter #3!', 'Order Ready')}
              >
                Trigger Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconBefore={<AlertTriangle size={16} color="var(--color-warning)" />}
                onClick={() => toast.warning('Only 3 portions of Dosa remaining.', 'Kitchen Alert')}
              >
                Trigger Warning Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconBefore={<Info size={16} color="var(--color-info)" />}
                onClick={() => toast.info('Canteen evening snack counter opens at 4:00 PM.', 'Campus Notice')}
              >
                Trigger Info Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.error('Unable to complete payment. Please retry.', 'Order Error')}
              >
                Trigger Error Toast
              </Button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Modal and Drawer Triggers */}
          <div>
            <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>Modal Dialog & Side Drawer</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Sample Modal
              </Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                Open Sample Drawer
              </Button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)' }} />

          {/* Loaders & Skeletons */}
          <div>
            <h4 className="type-h4" style={{ marginBottom: '0.75rem' }}>Loaders & Skeletons</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="md" showLabel={true} label="Fetching kitchen status..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="type-label">Text Skeletons</span>
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="type-label">Avatar & Rect</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Skeleton variant="circular" width="44px" height="44px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="60%" style={{ marginTop: '4px' }} />
                  </div>
                </div>
              </div>
              <div>
                <span className="type-label">Card Skeleton</span>
                <Skeleton variant="rectangular" height="70px" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Empty State Primitive */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Utensils size={22} color="var(--color-brand-primary)" />
          <h2 className="type-h2">7. Empty State Component</h2>
        </div>

        <EmptyState
          icon={<Utensils size={32} color="var(--color-brand-primary)" />}
          title="No Active Orders Placed Yet"
          description="Browse today's hot canteen specials, add your favorite snacks to your tray, and schedule your express pickup."
          action={
            <Button
              variant="primary"
              iconBefore={<ShoppingBag size={16} />}
              onClick={() => toast.info('Redirecting to full menu...')}
            >
              Browse Today's Menu
            </Button>
          }
        />
      </section>

      {/* Sample Modal Component Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Meal Schedule"
        description="Verify your express pickup details before dispatching to the canteen kitchen."
        actions={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false);
                toast.success('Pickup window confirmed for 12:30 PM!');
              }}
            >
              Confirm Schedule
            </Button>
          </>
        }
      >
        <p className="type-body" style={{ marginBottom: '1rem' }}>
          Your order will be queued for preparation at <strong>Central Kitchen — Counter #3</strong>. 
          Please arrive within 10 minutes of your selected pickup slot.
        </p>
        <div style={{ backgroundColor: 'var(--color-brand-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-brand-primary)' }}>
          <p className="type-body-sm" style={{ color: 'var(--color-brand-primary)', margin: 0, fontWeight: 600 }}>
            * Presentation of your digital token (CB-XXXX) is required for contactless meal handover.
          </p>
        </div>
      </Modal>

      {/* Sample Drawer Component Demo */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Quick Order Tray Preview"
        subtitle="2 items selected for pickup"
        footer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="type-label">Estimated Total</span>
              <span className="type-price">₹210</span>
            </div>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setDrawerOpen(false);
                toast.success('Proceeding to checkout...');
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FoodTypeIndicator isVeg={true} size="sm" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Royal Veg Biryani</span>
              </div>
              <span className="type-caption">Qty: 1 × ₹120</span>
            </div>
            <span className="type-price">₹120</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FoodTypeIndicator isVeg={true} size="sm" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Frothy Cold Coffee</span>
              </div>
              <span className="type-caption">Qty: 1 × ₹90</span>
            </div>
            <span className="type-price">₹90</span>
          </div>
        </div>
      </Drawer>
    </PageContainer>
  );
};
