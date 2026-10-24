import { supabase } from "./lib/supabase";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  Bell,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Heart,
  Home,
  ImagePlus,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Minus,
  Moon,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  TrendingDown,
  Upload,
  User,
  UserPlus,
  Users,
  Utensils,
  Warehouse,
  X,
  Zap,
} from "lucide-react";

type Role = "guest" | "owner" | "member" | "admin";
type Workspace = "personal" | "household";
type View =
  | "dashboard"
  | "inventory"
  | "scan"
  | "add"
  | "monitoring"
  | "usage"
  | "recipes"
  | "recipe"
  | "shopping"
  | "household"
  | "shared"
  | "notifications"
  | "settings"
  | "admin";
type Item = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  expiry: string;
  status: "Available" | "Low stock" | "Expiring soon" | "Expired";
  icon: string;
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1536489885071-87983c3e2859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1400";
const RECIPE_IMAGES = [
  "https://images.unsplash.com/photo-1585115054153-6b78d6f63985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  "https://images.unsplash.com/photo-1668887466922-5ed4bcd58ceb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
  "https://images.unsplash.com/photo-1591902060415-60a251d0ac68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900",
];

const initialItems: Item[] = [
  { id: 1, name: "Eggplant", category: "Vegetables", quantity: 3, unit: "pcs", location: "Refrigerator", expiry: "Sep 09", status: "Expiring soon", icon: "EG" },
  { id: 2, name: "Chicken thighs", category: "Meat", quantity: 1.2, unit: "kg", location: "Freezer", expiry: "Sep 18", status: "Available", icon: "CH" },
  { id: 3, name: "Coconut milk", category: "Canned Goods", quantity: 2, unit: "cans", location: "Pantry Cabinet", expiry: "Dec 03", status: "Available", icon: "CM" },
  { id: 4, name: "Tomatoes", category: "Vegetables", quantity: 2, unit: "pcs", location: "Refrigerator", expiry: "Sep 07", status: "Expired", icon: "TO" },
  { id: 5, name: "Garlic", category: "Vegetables", quantity: 1, unit: "head", location: "Kitchen Counter", expiry: "Sep 28", status: "Low stock", icon: "GA" },
  { id: 6, name: "Eggs", category: "Eggs", quantity: 8, unit: "pcs", location: "Refrigerator", expiry: "Sep 16", status: "Available", icon: "EE" },
  { id: 7, name: "Rice", category: "Grains", quantity: 4.5, unit: "kg", location: "Pantry Cabinet", expiry: "Jan 20", status: "Available", icon: "RI" },
  { id: 8, name: "Pechay", category: "Vegetables", quantity: 1, unit: "bunch", location: "Refrigerator", expiry: "Sep 10", status: "Expiring soon", icon: "PE" },
];

const recipes = [
  { id: 1, name: "Chicken Adobo", description: "A comforting Filipino classic simmered in soy, vinegar, and garlic.", match: 92, time: "45 min", meal: "Dinner", level: "Easy", image: RECIPE_IMAGES[0], available: ["Chicken", "Garlic", "Soy sauce", "Vinegar"], missing: ["Bay leaves"], optional: ["Black peppercorns"] },
  { id: 2, name: "Tortang Talong", description: "Smoky eggplant omelet, crisp at the edges and soft inside.", match: 88, time: "30 min", meal: "Breakfast", level: "Easy", image: RECIPE_IMAGES[1], available: ["Eggplant", "Eggs", "Garlic"], missing: ["Spring onion"], optional: ["Ground pork"] },
  { id: 3, name: "Ginisang Monggo", description: "Mung bean stew with greens for a filling family meal.", match: 76, time: "55 min", meal: "Lunch", level: "Medium", image: RECIPE_IMAGES[2], available: ["Tomatoes", "Garlic", "Pechay"], missing: ["Mung beans", "Onion"], optional: ["Chicharon"] },
  { id: 4, name: "Chicken Tinola", description: "Ginger-forward chicken soup with leafy greens.", match: 68, time: "50 min", meal: "Dinner", level: "Easy", image: RECIPE_IMAGES[0], available: ["Chicken", "Garlic", "Pechay"], missing: ["Ginger", "Green papaya"], optional: ["Chili leaves"] },
];

const navItems: { view: View; label: string; icon: typeof Home }[] = [
  { view: "dashboard", label: "Overview", icon: LayoutDashboard },
  { view: "inventory", label: "My pantry", icon: Package },
  { view: "scan", label: "Scan food", icon: ScanLine },
  { view: "recipes", label: "Recipes", icon: Utensils },
  { view: "shopping", label: "Shopping list", icon: ShoppingBasket },
  { view: "monitoring", label: "Food monitoring", icon: Clock3 },
  { view: "household", label: "Household", icon: Users },
];

const memberNavItems: { view: View; label: string; icon: typeof Home }[] = [
  { view: "dashboard", label: "Overview", icon: LayoutDashboard },
  { view: "shared", label: "Shared pantry", icon: Warehouse },
  { view: "usage", label: "Record usage", icon: TrendingDown },
  { view: "recipes", label: "Recipes", icon: Utensils },
  { view: "monitoring", label: "Food alerts", icon: Clock3 },
  { view: "household", label: "Household access", icon: Users },
];

const categories = ["Vegetables", "Fruits", "Meat", "Seafood", "Dairy", "Eggs", "Grains", "Canned Goods", "Condiments", "Beverages", "Frozen Food", "Other"];
const locations = ["Refrigerator", "Freezer", "Pantry Cabinet", "Kitchen Counter", "Other"];

function Button({ children, variant = "primary", icon, onClick, type = "button", className = "", disabled = false }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "soft"; icon?: ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string; disabled?: boolean }) {
  return <button className={`btn btn-${variant} ${className}`} onClick={onClick} type={type} disabled={disabled}>{icon}{children}</button>;
}

function Input({ label, icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: ReactNode }) {
  return <label className="field">{label && <span>{label}</span>}<div className="input-wrap">{icon}<input {...props} /></div></label>;
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; children: ReactNode }) {
  return <label className="field">{label && <span>{label}</span>}<div className="select-wrap"><select {...props}>{children}</select><ChevronDown size={16} /></div></label>;
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <section className={`card ${className}`} onClick={onClick}>{children}</section>;
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const modalRef = useRef<HTMLElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.querySelector<HTMLElement>("button, input, select, textarea")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = [...modalRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section ref={modalRef} className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>{children}</section></div>;
}

function StatusBadge({ status }: { status: Item["status"] }) {
  const tone = status === "Available" ? "success" : status === "Expired" ? "danger" : "warning";
  return <Badge tone={tone}><span className="status-dot" />{status}</Badge>;
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <div className={`logo ${inverse ? "logo-inverse" : ""}`}><span className="logo-mark"><ScanLine size={20} /></span><span>PantryLens</span></div>;
}

function Toast({ text }: { text: string }) {
  return <div className="toast"><CheckCircle2 size={18} /><span>{text}</span></div>;
}

function Landing({ onEnter, onAuth }: { onEnter: () => void; onAuth: (mode: "login" | "signup") => void }) {
  return <main className="landing">
    <header className="landing-nav !h-auto !min-h-[calc(4.25rem+env(safe-area-inset-top))] !pt-[calc(env(safe-area-inset-top)+1rem)] !pb-4 max-md:!relative max-md:!z-10 max-md:!translate-y-14 md:!h-[82px] md:!min-h-0 md:!pt-0 md:!pb-0">
      <Logo />
      <nav className="landing-links" aria-label="Public navigation">
        <a href="#features">Features</a><a href="#how">How it works</a><a href="#recipes">Recipes</a>
      </nav>
      <div className="landing-actions"><Button className="max-md:!flex max-md:!min-h-9 max-md:!px-2 max-md:!text-[10px]" variant="ghost" onClick={() => onAuth("login")}>Log in</Button><Button className="max-md:!min-h-9 max-md:!px-2 max-md:!text-[10px]" onClick={() => onAuth("signup")}>Create account</Button></div>
    </header>
    <section className="hero">
      <div className="hero-copy">
        <Badge tone="success">Smarter food, less waste</Badge>
        <h1>Know what you have.<br /><em>Cook what you love.</em></h1>
        <p>PantryLens helps Filipino households see what’s available, use food before it expires, and turn everyday ingredients into delicious meals.</p>
        <div className="hero-actions"><Button onClick={() => onAuth("signup")} icon={<ArrowRightIcon />}>Start your pantry</Button><Button variant="secondary" onClick={onEnter} icon={<Eye size={18} />}>Explore guest demo</Button></div>
        <div className="trust-row"><span><Check size={15} /> No credit card</span><span><Check size={15} /> Free prototype</span><span><Check size={15} /> Filipino recipes</span></div>
      </div>
      <div className="hero-visual">
        <img src={HERO_IMAGE} alt="A Filipino meal with grilled eggplant, okra, rice, and salted egg" />
        <div className="scan-frame"><span /><span /><span /><span /></div>
        <div className="floating-card float-top"><span className="food-icon"><ScanLine size={21} /></span><div><b>Eggplant detected</b><small>96% confidence · demo</small></div><CheckCircle2 size={19} /></div>
        <div className="floating-card float-bottom"><Clock3 size={20} /><div><b>Use soon</b><small>3 items expire this week</small></div></div>
      </div>
    </section>
    <section className="brand-strip"><span>See what’s fresh</span><strong>8 pantry items tracked</strong><span>Plan what to cook</span><strong>92% recipe match</strong><span>Waste less</span></section>
    <section className="landing-section" id="features">
      <div className="eyebrow">Everything in one pantry</div><h2>Less guessing. More lutong-bahay.</h2><p className="section-lede">From grocery day to dinner time, PantryLens keeps the household in sync.</p>
      <div className="feature-grid">
        <Card className="feature-card"><div className="feature-icon green"><ScanLine /></div><h3>Scan food in seconds</h3><p>Capture or upload an image, review multiple detected items, and correct labels before saving.</p><button onClick={onEnter}>Try demo scan <ChevronRight size={16} /></button></Card>
        <Card className="feature-card"><div className="feature-icon amber"><Clock3 /></div><h3>Use it before you lose it</h3><p>Track expiry dates and low stock thresholds with clear, actionable reminders.</p><button onClick={onEnter}>View monitoring <ChevronRight size={16} /></button></Card>
        <Card className="feature-card"><div className="feature-icon tomato"><Utensils /></div><h3>Cook from your pantry</h3><p>See match scores, ingredients on hand, and exactly what’s missing from each recipe.</p><button onClick={onEnter}>Browse recipes <ChevronRight size={16} /></button></Card>
      </div>
    </section>
    <section className="how-section" id="how">
      <div><div className="eyebrow">Designed for real kitchens</div><h2>One photo. A pantry you can trust.</h2><p>Recognition results are always reviewable. Expiration dates remain yours to enter from the package—PantryLens never pretends a photo can know them.</p><div className="steps"><span><b>01</b> Capture or upload</span><span><b>02</b> Review detected food</span><span><b>03</b> Confirm and organize</span></div><Button onClick={onEnter}>Try the demo scan</Button></div>
      <div className="demo-scan"><div className="demo-image"><img src={RECIPE_IMAGES[1]} alt="Prepared food for the recognition demonstration" /><span className="box-label">Eggplant · 94%</span></div><div className="demo-result"><Badge tone="info">Demo recognition</Badge><h3>2 items found</h3><div><span className="food-initial">EG</span><b>Eggplant</b><small>94%</small></div><div><span className="food-initial">EE</span><b>Eggs</b><small>89%</small></div></div></div>
    </section>
    <section className="landing-section" id="recipes">
      <div className="eyebrow">Made for Filipino tables</div><h2>Start with what you already have.</h2>
      <div className="recipe-preview-grid">{recipes.slice(0, 3).map((recipe) => <article className="landing-recipe" key={recipe.id}><img src={recipe.image} alt={recipe.name} /><div><Badge tone="success">{recipe.match}% match</Badge><h3>{recipe.name}</h3><p>{recipe.description}</p><span>{recipe.time} · {recipe.level}</span></div></article>)}</div>
    </section>
    <footer className="landing-footer"><div><Logo inverse /><p>A computer vision–based pantry management and recipe recommendation prototype for Filipino households.</p></div><div><b>Product</b><a href="#features">Features</a><a href="#how">Recognition</a><a href="#recipes">Recipes</a></div><div><b>Important</b><span>Demo data only</span><span>Recognition limitations</span><span>Privacy & terms</span></div></footer>
  </main>;
}


function AuthModal({
  mode,
  onClose,
  onSuccess,
}: {
  mode: "login" | "signup";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!forgot && password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (mode === "signup" && !forgot) {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }

      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        setError("Use at least one uppercase letter and one number in your password.");
        return;
      }
    }

    setBusy(true);

    try {
      if (forgot) {
        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(cleanEmail, {
            redirectTo: window.location.origin,
          });

        if (resetError) throw resetError;

        setMessage("If an account exists for this email, password reset instructions will be sent.");
        return;
      }

      if (mode === "login") {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

        if (loginError) throw loginError;

        onSuccess();
        return;
      }

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
            emailRedirectTo: window.location.origin,
          },
        });

      if (signupError) throw signupError;

      if (data.session) {
        onSuccess();
      } else {
        setMessage(
          "Your account request was received. Check your email for a confirmation link before logging in."
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={
        forgot
          ? "Reset your password"
          : mode === "login"
            ? "Welcome back"
            : "Create your PantryLens account"
      }
      onClose={onClose}
    >
      <p className="modal-subtitle">
        {forgot
          ? "Enter your email address to request a password reset."
          : mode === "login"
            ? "Log in to access your PantryLens account."
            : "Create your account to get started. You can create or join a household later."}
      </p>

      <form className="form-stack" onSubmit={submit}>
        {mode === "signup" && !forgot && (
          <label className="field">
            <span>Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Juan Dela Cruz"
              autoComplete="name"
              required
            />
          </label>
        )}

        <label className="field">
          <span>Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        {!forgot && (
          <label className="field">
            <span>Password</span>
            <div className="input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={8}
                required
              />
              <button
                type="button"
                className="field-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>
        )}

        {mode === "signup" && !forgot && (
          <>
            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <div className="password-rules">
              <span><Check size={14} /> 8+ characters</span>
              <span><Check size={14} /> Uppercase and number</span>
            </div>

            <label className="checkbox">
              <input type="checkbox" required />
              <span>I accept the Terms of Use and Privacy Notice.</span>
            </label>
          </>
        )}

        {mode === "login" && !forgot && (
          <button
            type="button"
            className="text-link align-right"
            onClick={() => {
              setForgot(true);
              setError("");
              setMessage("");
            }}
          >
            Forgot password?
          </button>
        )}

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}

        {message && (
          <p role="status" className="auth-note">
            {message}
          </p>
        )}

        <Button type="submit" disabled={busy}>
          {busy
            ? "Please wait..."
            : forgot
              ? "Send reset link"
              : mode === "login"
                ? "Log in"
                : "Create account"}
        </Button>

        {forgot && (
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setForgot(false);
              setError("");
              setMessage("");
            }}
          >
            Back to login
          </button>
        )}

        <div className="auth-note">
          <ShieldCheck size={16} />
          <span>
            Authentication is handled by Supabase. Never share your password
            with anyone.
          </span>
        </div>
      </form>
    </Modal>
  );
}


function AppShell({ role, user, onRoleChange, onExit }: { role: Role; user: { id: string; email?: string; user_metadata?: { full_name?: string } } | null; onRoleChange: (role: Role) => void; onExit: () => void }) {
  const [view, setView] = useState<View>(role === "admin" ? "admin" : "dashboard");
  const [items, setItems] = useState(initialItems);
  const [workspace, setWorkspace] = useState<Workspace>(role === "owner" ? "personal" : "household");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [authGate, setAuthGate] = useState(false);
  const [toast, setToast] = useState("");
  const [notificationCount, setNotificationCount] = useState(4);
  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      setProfileOpen(false);
      setContextOpen(false);
    };
    document.addEventListener("keydown", closeMenus);
    return () => document.removeEventListener("keydown", closeMenus);
  }, []);

  const navigate = (requested: View) => {
    const memberAllowed: View[] = ["dashboard", "shared", "usage", "recipes", "recipe", "monitoring", "household", "notifications", "settings"];
    const adminAllowed: View[] = ["admin", "notifications", "settings"];
    const next = role === "member"
      ? requested === "inventory" ? "shared" : memberAllowed.includes(requested) ? requested : "dashboard"
      : role === "admin"
        ? adminAllowed.includes(requested) ? requested : "admin"
        : requested === "admin" ? "dashboard" : requested;
    setView(next);
    setMobileOpen(false);
    setContextOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const gated = (action: () => void) => { if (role === "guest") setAuthGate(true); else action(); };
  const notify = (text: string) => { setToast(text); window.setTimeout(() => setToast(""), 2600); };
  const switchRole = (nextRole: Role, nextView: View) => {
    onRoleChange(nextRole);
    setView(nextView);
    setProfileOpen(false);
    setContextOpen(false);
  };

  const page = () => {
    if (view === "dashboard") return <Dashboard navigate={navigate} role={role} items={items} />;
    if (view === "inventory" || view === "shared") return <Inventory items={items} setItems={setItems} role={role} gated={gated} notify={notify} shared={view === "shared"} navigate={navigate} />;
    if (view === "scan") return <ScanPage role={role} gated={gated} notify={notify} navigate={navigate} />;
    if (view === "add") return <AddItem role={role} gated={gated} notify={notify} navigate={navigate} />;
    if (view === "monitoring") return <Monitoring items={items} navigate={navigate} role={role} gated={gated} notify={notify} />;
    if (view === "usage") return <UsageHistory role={role} gated={gated} notify={notify} />;
    if (view === "recipes") return <Recipes navigate={navigate} role={role} gated={gated} notify={notify} />;
    if (view === "recipe") return <RecipeDetail navigate={navigate} role={role} gated={gated} notify={notify} />;
    if (view === "shopping") return <ShoppingList role={role} gated={gated} notify={notify} />;
    if (view === "household") return <Household role={role} workspace={workspace} setWorkspace={setWorkspace} gated={gated} notify={notify} navigate={navigate} />;
    if (view === "notifications") return <Notifications count={notificationCount} setCount={setNotificationCount} role={role} gated={gated} />;
    if (view === "settings") {
      return <SettingsPage role={role} workspace={workspace} gated={gated} notify={notify} user={user} />;
    }
    return <AdminPage notify={notify} />;
  };

  const activeNav = role === "admin"
    ? [{ view: "admin" as View, label: "Admin console", icon: ShieldCheck }, { view: "settings" as View, label: "Admin settings", icon: Settings }]
    : role === "member" ? memberNavItems : navItems;
  return <div className="app-shell">
    <aside id="primary-navigation" className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-top"><Logo inverse /><button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></button></div>
      {role === "guest" && <div className="demo-pill"><Eye size={15} /><span><b>Guest preview</b><small>Read-only demo data</small></span></div>}
      {role === "member" && <div className="demo-pill"><Users size={15} /><span><b>Member preview</b><small>Shared and assigned records only</small></span></div>}
      {role === "admin" && <div className="demo-pill admin-pill"><ShieldCheck size={15} /><span><b>Admin preview</b><small>Simulated system data</small></span></div>}
      <nav className="side-nav" aria-label="Main navigation">
        <small>Workspace</small>
        {activeNav.map(({ view: navView, label, icon: Icon }) => <button key={navView} className={view === navView ? "active" : ""} onClick={() => navigate(navView)}><Icon size={19} /><span>{label}</span>{view === navView && <span className="nav-active-dot" />}</button>)}
        {(role === "owner" || role === "guest") && <><small>Activity</small><button className={view === "usage" ? "active" : ""} onClick={() => navigate("usage")}><TrendingDown size={19} /><span>Usage history</span></button><button className={view === "shared" ? "active" : ""} onClick={() => navigate("shared")}><Warehouse size={19} /><span>Shared inventory</span></button></>}
      </nav>
      <div className="side-footer"><button onClick={() => navigate("settings")}><Settings size={19} /><span>Settings</span></button><button onClick={onExit}><LogOut size={19} /><span>Back to public site</span></button></div>
    </aside>
    {mobileOpen && <div className="mobile-scrim" onClick={() => setMobileOpen(false)} />}
    <div className="app-main">
      <header className="topbar">
        <button className="menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded={mobileOpen}><Menu /></button>
        <div className="context-menu">
          <button className="context-switcher" disabled={role === "admin" || role === "member"} onClick={() => setContextOpen(!contextOpen)} aria-expanded={contextOpen}>
            <span className="avatar-house">{role === "admin" ? "PL" : role === "member" ? "DC" : workspace === "personal" ? "JP" : "DC"}</span>
            <span><small>{role === "admin" ? "Protected area" : role === "member" ? "Shared access" : "Viewing pantry"}</small><b>{role === "admin" ? "PantryLens system" : role === "member" ? "Dela Cruz Home" : workspace === "personal" ? "Juan’s personal pantry" : "Dela Cruz Home"}</b></span>
            {role !== "admin" && role !== "member" && <ChevronDown size={16} />}
          </button>
          {contextOpen && <div className="context-popover">
            <small>Choose workspace</small>
            <button className={workspace === "personal" ? "active" : ""} onClick={() => { setWorkspace("personal"); navigate("dashboard"); }}><User size={17} /><span><b>Personal pantry</b><small>Private to this account</small></span>{workspace === "personal" && <Check size={16} />}</button>
            <button className={workspace === "household" ? "active" : ""} onClick={() => { setWorkspace("household"); navigate("dashboard"); }}><Users size={17} /><span><b>Dela Cruz Home</b><small>Shared household inventory</small></span>{workspace === "household" && <Check size={16} />}</button>
            <button onClick={() => gated(() => { setWorkspace("personal"); navigate("household"); })}><Plus size={17} /><span><b>Create a household</b><small>Start from your personal pantry</small></span></button>
          </div>}
        </div>
        <div className="top-actions">
          {(role === "owner" || role === "guest") && <Button className="top-add" onClick={() => gated(() => navigate("add"))} icon={<Plus size={17} />}>Add item</Button>}
          <button className="icon-btn notification-btn" aria-label="Notifications" onClick={() => navigate("notifications")}><Bell size={20} />{notificationCount > 0 && <span>{notificationCount}</span>}</button>
          <div className="profile-menu"><button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen} aria-label="Open profile menu"><span className="profile-avatar">{role === "admin" ? "AD" : role === "member" ? "MD" : role === "guest" ? "GU" : (user?.user_metadata?.full_name || "Juan Dela Cruz").split(/\s+/).map((name) => name[0]).join("").slice(0, 2).toUpperCase()}</span><span><b>
  {role === "admin"
    ? "System Admin"
    : role === "member"
      ? "Maria Dela Cruz"
      : role === "guest"
        ? "Guest visitor"
        : user?.user_metadata?.full_name || user?.email || "My account"}
</b>
<small>
  {role === "guest"
    ? "Preview mode"
    : role === "member"
      ? "Household member"
      : user?.email || "No email available"}
</small></span><ChevronDown size={16} /></button>
          {profileOpen && <div className="profile-popover"><button onClick={() => { navigate("settings"); setProfileOpen(false); }}><User size={17} /> Profile & settings</button>{role !== "admin" && role !== "member" && <button onClick={() => switchRole("member", "dashboard")}><Users size={17} /> Open member demo</button>}{role === "member" && <button onClick={() => switchRole("owner", "dashboard")}><ArrowLeft size={17} /> Exit member demo</button>}<button onClick={() => role === "admin" ? switchRole("guest", "dashboard") : switchRole("admin", "admin")}><ShieldCheck size={17} /> {role === "admin" ? "Exit admin preview" : "Open admin demo"}</button><button onClick={onExit}><LogOut size={17} /> Log out / exit</button></div>}</div>
        </div>
      </header>
      {role === "guest" && <div className="guest-banner"><Eye size={17} /><span>You’re exploring preview data. Sign in to create, edit, save, or join a household.</span><button onClick={() => setAuthGate(true)}>Sign in for full access</button></div>}
      {role === "member" && <div className="access-banner"><ShieldCheck size={17} /><span>Member access: you can view shared inventory, record usage, and update assigned records only.</span></div>}
      {role === "admin" && <div className="admin-access-banner"><ShieldCheck size={17} /><span>Protected admin preview. Production access must be verified by server-side role checks and database policies.</span></div>}
      <main className="page-container">{page()}</main>
      <nav className="mobile-bottom">{activeNav.slice(0, 5).map(({ view: navView, label, icon: Icon }) => <button key={navView} className={view === navView ? "active" : ""} onClick={() => navigate(navView)}><Icon size={20} /><span>{label.split(" ")[0]}</span></button>)}</nav>
    </div>
    {authGate && <Modal title="Sign in to continue" onClose={() => setAuthGate(false)}><div className="gate-content"><div className="gate-icon"><ShieldCheck /></div><h3>Your preview stays right here</h3><p>Create an account or log in to save changes, update inventory, manage households, and personalize alerts. Guest previews never access private household data.</p><Button onClick={() => { setAuthGate(false); onRoleChange("owner"); }}>Continue with demo account</Button><Button variant="secondary" onClick={() => setAuthGate(false)}>Keep exploring</Button></div></Modal>}
    {toast && <Toast text={toast} />}
  </div>;
}

function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{actions && <div className="page-actions">{actions}</div>}</div>;
}

function Dashboard({ navigate, role, items }: { navigate: (view: View) => void; role: Role; items: Item[] }) {
  const statCards = [
    { label: role === "member" ? "Shared items" : "Pantry items", value: items.length, meta: role === "member" ? "Authorized household records" : "Across 4 locations", icon: Package, tone: "green", view: (role === "member" ? "shared" : "inventory") as View },
    { label: "Expiring soon", value: items.filter((i) => i.status === "Expiring soon").length, meta: "Within 5 days", icon: Clock3, tone: "amber", view: "monitoring" as View },
    { label: "Low stock", value: items.filter((i) => i.status === "Low stock").length, meta: "Needs attention", icon: TrendingDown, tone: "orange", view: "monitoring" as View },
    { label: "Recipe matches", value: "12", meta: "Best match 92%", icon: Utensils, tone: "sage", view: "recipes" as View },
  ];
  return <>
    <PageHeader eyebrow={role === "guest" ? "Preview workspace" : role === "member" ? "Dela Cruz Home · Member access" : "Tuesday, September 8"} title={`Magandang umaga, ${role === "member" ? "Maria" : "Juan"}!`} description={role === "member" ? "Here’s what needs attention in the inventory shared with you." : "Here’s what’s happening in your pantry today."} actions={<Button variant="secondary" onClick={() => navigate("monitoring")} icon={<SlidersHorizontal size={17} />}>View food status</Button>} />
    <div className="stats-grid">{statCards.map(({ label, value, meta, icon: Icon, tone, view }) => <Card className="stat-card" key={label} onClick={() => navigate(view)}><div className={`stat-icon ${tone}`}><Icon size={21} /></div><span>{label}</span><strong>{value}</strong><small>{meta}</small><ChevronRight className="stat-arrow" size={18} /></Card>)}</div>
    <div className="dashboard-grid">
      <Card className="attention-card">
        <div className="card-heading"><div><h2>Needs your attention</h2><p>Handle these items soon to reduce waste.</p></div><button onClick={() => navigate("monitoring")}>View all <ChevronRight size={16} /></button></div>
        <div className="attention-list">{items.filter((i) => i.status !== "Available").slice(0, 4).map((item) => <button key={item.id} onClick={() => navigate(role === "member" ? "shared" : "inventory")}><span className="item-emoji">{item.icon}</span><span><b>{item.name}</b><small>{item.quantity} {item.unit} · {item.location}</small></span><StatusBadge status={item.status} /><ChevronRight size={17} /></button>)}</div>
      </Card>
      <Card className="quick-card"><div className="card-heading"><div><h2>Quick actions</h2><p>{role === "member" ? "Work with records shared with you." : "Keep your pantry up to date."}</p></div></div>{role === "member" ? <div className="quick-grid"><button onClick={() => navigate("shared")}><span><Warehouse /></span><b>Shared pantry</b><small>View authorized items</small></button><button onClick={() => navigate("usage")}><span><TrendingDown /></span><b>Record usage</b><small>Update shared quantities</small></button><button onClick={() => navigate("recipes")}><span><Utensils /></span><b>Find a recipe</b><small>Use shared ingredients</small></button><button onClick={() => navigate("monitoring")}><span><Clock3 /></span><b>Food alerts</b><small>Review relevant items</small></button></div> : <div className="quick-grid"><button onClick={() => navigate("scan")}><span><ScanLine /></span><b>Scan food</b><small>Use a photo</small></button><button onClick={() => navigate("add")}><span><Plus /></span><b>Add manually</b><small>Enter details</small></button><button onClick={() => navigate("recipes")}><span><Utensils /></span><b>Find a recipe</b><small>Cook what you have</small></button><button onClick={() => navigate("shopping")}><span><ShoppingBasket /></span><b>Shopping list</b><small>3 to pick up</small></button></div>}</Card>
    </div>
    <div className="section-heading"><div><h2>Made for your pantry</h2><p>Recipes ranked by your available ingredients.</p></div><button onClick={() => navigate("recipes")}>Browse all recipes <ChevronRight size={16} /></button></div>
    <div className="dash-recipes">{recipes.slice(0, 3).map((recipe) => <article key={recipe.id} onClick={() => navigate("recipe")}><div className="recipe-img"><img src={recipe.image} alt={recipe.name} /><Badge tone="success">{recipe.match}% match</Badge><button aria-label="Save recipe" onClick={(event) => { event.stopPropagation(); navigate("recipe"); }}><Heart size={17} /></button></div><div><h3>{recipe.name}</h3><p>{recipe.description}</p><span>{recipe.time} · {recipe.level}</span></div></article>)}</div>
    <Card className="activity-card"><div className="card-heading"><div><h2>Recent pantry activity</h2><p>Latest updates from your household.</p></div><button onClick={() => navigate("usage")}>View history <ChevronRight size={16} /></button></div><div className="activity-row"><span className="activity-icon consumed"><Minus /></span><div><b>Maria recorded 2 eggs used</b><small>Today, 8:40 AM · Breakfast</small></div><Badge>Usage</Badge></div><div className="activity-row"><span className="activity-icon added"><Plus /></span><div><b>You added chicken thighs</b><small>Yesterday, 6:12 PM · Freezer</small></div><Badge tone="success">Added</Badge></div></Card>
  </>;
}

function Inventory({ items, setItems, role, gated, notify, shared, navigate }: { items: Item[]; setItems: React.Dispatch<React.SetStateAction<Item[]>>; role: Role; gated: (fn: () => void) => void; notify: (text: string) => void; shared: boolean; navigate: (view: View) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState(() => {
    try { return (JSON.parse(window.localStorage.getItem(`pantrylens-settings-${role}`) || "{}") as Partial<SettingsData>).inventorySort || "Recently added"; }
    catch { return "Recently added"; }
  });
  const [grid, setGrid] = useState(true);
  const [selected, setSelected] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const assignedItemIds = [1, 2, 6];
  const canEditItem = (item: Item) => role !== "member" || assignedItemIds.includes(item.id);
  const filtered = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || i.category === category) && (status === "All statuses" || i.status === status)).sort((a, b) => sort === "Name" || sort === "Name A–Z" ? a.name.localeCompare(b.name) : sort === "Quantity" ? b.quantity - a.quantity : sort === "Expiration date" ? a.expiry.localeCompare(b.expiry) : b.id - a.id);
  const remove = () => { if (!deleteItem) return; setItems((all) => all.filter((i) => i.id !== deleteItem.id)); notify(`${deleteItem.name} deleted from demo inventory`); setDeleteItem(null); };
  return <>
    <PageHeader eyebrow={shared ? "Dela Cruz Home" : "Inventory"} title={shared ? "Shared inventory" : "Your pantry"} description={shared ? role === "member" ? "Shared household items and the records assigned to you." : "Review the inventory shared with household members." : `${items.length} active items across your kitchen.`} actions={role !== "member" ? <><Button variant="secondary" onClick={() => navigate("scan")} icon={<ScanLine size={17} />}>Scan food</Button><Button onClick={() => gated(() => navigate("add"))} icon={<Plus size={17} />}>Add item</Button></> : <Button onClick={() => navigate("usage")} icon={<TrendingDown size={17} />}>Record usage</Button>} />
    {shared && <Card className="info-banner"><Users size={20} /><div><b>{role === "member" ? "Member permissions" : "Shared household preview"}</b><p>{role === "member" ? "You can view shared items, record usage, and edit only the records marked Assigned to you. Delete and ownership controls are hidden." : "Household members see only shared records. Assigned-record and usage permissions must also be enforced by backend policies."}</p></div></Card>}
    <Card className="inventory-toolbar"><Input aria-label="Search inventory" placeholder="Search food items…" value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search size={18} />} /><Select value={category} onChange={(e) => setCategory(e.target.value)}>{["All categories", ...categories].map((option) => <option key={option}>{option}</option>)}</Select><Select value={status} onChange={(e) => setStatus(e.target.value)}>{["All statuses", "Available", "Low stock", "Expiring soon", "Expired"].map((option) => <option key={option}>{option}</option>)}</Select><Select aria-label="Sort inventory" value={sort} onChange={(event) => setSort(event.target.value)}><option>Recently added</option><option>Name A–Z</option><option>Expiration date</option><option>Quantity</option></Select><div className="view-toggle"><button className={grid ? "active" : ""} onClick={() => setGrid(true)} aria-label="Grid view"><LayoutDashboard size={17} /></button><button className={!grid ? "active" : ""} onClick={() => setGrid(false)} aria-label="Table view"><List size={17} /></button></div></Card>
    <div className="result-count"><span>{filtered.length} items</span><span>Demo inventory · updated just now</span></div>
    {filtered.length === 0 ? <Card className="empty-state"><Search /><h2>No pantry items found</h2><p>Try changing your search or filters.</p><Button variant="secondary" onClick={() => { setQuery(""); setCategory("All categories"); setStatus("All statuses"); }}>Clear filters</Button></Card> :
    grid ? <div className="inventory-grid">{filtered.map((item) => <article className="inventory-card" key={item.id}><div className="inventory-image"><span>{item.icon}</span><StatusBadge status={item.status} />{role === "member" && assignedItemIds.includes(item.id) ? <span className="assigned-badge"><Badge tone="info">Assigned</Badge></span> : <button aria-label={`View actions for ${item.name}`} onClick={() => setSelected(item)}><MoreHorizontal size={18} /></button>}</div><div><span className="category-label">{item.category}</span><h3>{item.name}</h3><strong>{item.quantity} <small>{item.unit}</small></strong><div className="item-meta"><span><Warehouse size={14} />{item.location}</span><span><Clock3 size={14} />Expires {item.expiry}</span></div><div className="item-actions"><Button variant="secondary" onClick={() => setSelected(item)}>View details</Button>{canEditItem(item) && <button aria-label={`Edit ${item.name}`} onClick={() => gated(() => notify("Edit form opened in demo mode"))}><Pencil size={17} /></button>}{role !== "member" && <button aria-label={`Delete ${item.name}`} onClick={() => gated(() => setDeleteItem(item))}><Trash2 size={17} /></button>}</div></div></article>)}</div> :
    <Card className="table-card"><div className="data-table"><div className="table-head"><span>Item</span><span>Quantity</span><span>Location</span><span>Expiration</span><span>Status</span><span /></div>{filtered.map((item) => <div className="table-row" key={item.id}><span className="table-item"><i>{item.icon}</i><span><b>{item.name}</b><small>{item.category}</small></span></span><span>{item.quantity} {item.unit}</span><span>{item.location}</span><span>{item.expiry}</span><span><StatusBadge status={item.status} /></span><button onClick={() => setSelected(item)} aria-label={`View ${item.name}`}><ChevronRight size={18} /></button></div>)}</div></Card>}
    {selected && <Modal title={selected.name} onClose={() => setSelected(null)}><div className="detail-hero"><span>{selected.icon}</span><div><Badge>{selected.category}</Badge><h3>{selected.quantity} {selected.unit} available</h3><StatusBadge status={selected.status} /></div></div>{role === "member" && <div className="permission-note"><ShieldCheck size={17} /><span>{canEditItem(selected) ? "This record is assigned to you. You may record usage and update permitted fields." : "View-only shared record. You may record usage but cannot edit item details."}</span></div>}<div className="detail-grid"><div><small>Storage</small><b>{selected.location}</b></div><div><small>Expiration</small><b>{selected.expiry}</b></div><div><small>Minimum stock</small><b>2 {selected.unit}</b></div><div><small>Last updated</small><b>Today, 8:40 AM</b></div></div><h3 className="subheading">Recent history</h3><div className="mini-timeline"><span /><div><b>Quantity updated</b><small>3 → {selected.quantity} {selected.unit} · Maria</small></div></div><div className="modal-actions"><Button variant="secondary" onClick={() => gated(() => navigate("usage"))}>Record usage</Button>{canEditItem(selected) && <Button onClick={() => gated(() => notify("Item changes saved in demo"))}>Edit item</Button>}</div></Modal>}
    {deleteItem && <Modal title={`Delete ${deleteItem.name}?`} onClose={() => setDeleteItem(null)}><div className="warning-box"><AlertTriangle /><p>This removes the item from available inventory. Its audit history remains available in production.</p></div><div className="modal-actions"><Button variant="secondary" onClick={() => setDeleteItem(null)}>Cancel</Button><Button variant="danger" onClick={remove}>Delete item</Button></div></Modal>}
  </>;
}

function ScanPage({ role, gated, notify, navigate }: { role: Role; gated: (fn: () => void) => void; notify: (text: string) => void; navigate: (v: View) => void }) {
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const runScan = () => { setStep("processing"); window.setTimeout(() => setStep("results"), 1500); };
  return <>
    <PageHeader eyebrow="Food recognition" title="Scan food items" description="Upload or capture food, then review every result before it reaches your pantry." actions={<Badge tone="info"><Sparkles size={14} /> Simulated recognition service</Badge>} />
    <div className="stepper"><span className={step !== "upload" ? "done" : "active"}><b>{step === "upload" ? "1" : <Check size={15} />}</b> Add image</span><i /><span className={step === "processing" ? "active" : step === "results" ? "done" : ""}><b>2</b> Analyze</span><i /><span className={step === "results" ? "active" : ""}><b>3</b> Confirm details</span></div>
    {step === "upload" && <Card className="scan-panel"><div className="upload-zone" onClick={() => fileRef.current?.click()}><input ref={fileRef} type="file" accept="image/*" onChange={runScan} /><span className="upload-icon"><ImagePlus /></span><h2>Drop a food photo here</h2><p>or choose a clear image from your device</p><Button variant="secondary" onClick={() => fileRef.current?.click()} icon={<Upload size={17} />}>Choose image</Button><small>JPG, PNG, or HEIC · max 10 MB</small></div><div className="or-divider"><span>or</span></div><Button className="camera-button" onClick={runScan} icon={<Camera size={18} />}>Open camera</Button><div className="scan-tips"><h3>For better recognition</h3><div><span><Sun /></span><p><b>Use good lighting</b><small>Avoid heavy shadows or glare</small></p></div><div><span><Eye /></span><p><b>Keep items visible</b><small>Separate overlapping food when possible</small></p></div><div><span><Pencil /></span><p><b>You stay in control</b><small>Correct labels and enter package dates manually</small></p></div></div></Card>}
    {step === "processing" && <Card className="processing-card"><div className="scanner-animation"><ScanLine /><i /></div><h2>Looking closely at your food…</h2><p>Demo model is finding items and estimating labels. This does not infer expiration dates.</p><div className="progress"><span /></div><small>Analyzing image · simulated</small><Button variant="ghost" onClick={() => setStep("upload")}>Cancel</Button></Card>}
    {step === "results" && <div className="scan-results-layout"><Card className="scan-preview"><div className="preview-image"><img src="https://images.unsplash.com/photo-1545576300-c7744d48aead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900" alt="Vegetables in the demo scan" /><span className="detection-box box-one"><b>Eggplant · 96%</b></span><span className="detection-box box-two"><b>Tomato · 91%</b></span></div><div className="preview-actions"><Button variant="secondary" onClick={() => setStep("upload")} icon={<RefreshCw size={17} />}>Replace photo</Button><Button variant="ghost" onClick={() => setStep("upload")} icon={<Trash2 size={17} />}>Remove</Button></div><div className="recognition-note"><CircleHelp size={18} /><span>Confidence is a model estimate, not a guarantee. Check every label before saving.</span></div></Card><div className="result-column"><Card><div className="card-heading"><div><h2>2 items detected</h2><p>Review names, quantities, and dates.</p></div><Badge tone="info">Demo results</Badge></div><DetectedItem name="Eggplant" confidence={96} icon="EG" /><DetectedItem name="Tomatoes" confidence={91} icon="TO" /><button className="add-detected" onClick={() => notify("Blank detected-item form added")}><Plus size={17} /> Add another detected item</button></Card><div className="scan-footer"><Button variant="secondary" onClick={() => setStep("upload")}>Start over</Button><Button onClick={() => gated(() => { notify("2 items added to demo pantry"); navigate("inventory"); })} icon={<Check size={17} />}>Confirm and add 2 items</Button></div></div></div>}
  </>;
}

function DetectedItem({ name, confidence, icon }: { name: string; confidence: number; icon: string }) {
  const [open, setOpen] = useState(true);
  const [defaults] = useState(() => {
    try {
      return { ...defaultSettings("owner"), ...JSON.parse(window.localStorage.getItem("pantrylens-settings-owner") || "{}") } as SettingsData;
    } catch {
      return defaultSettings("owner");
    }
  });
  return <div className="detected-item"><button className="detected-head" onClick={() => setOpen(!open)}><span>{icon}</span><span><b>{name}</b><small>{confidence}% confidence</small></span><Badge tone="success">High confidence</Badge><ChevronDown className={open ? "rotate" : ""} size={18} /></button>{open && <div className="detected-form"><Input label="Food name" defaultValue={name} /><Select label="Category" defaultValue="Vegetables">{categories.map((c) => <option key={c}>{c}</option>)}</Select><div className="split-fields"><Input label="Quantity" type="number" defaultValue="2" min="0" /><Select label="Unit" defaultValue={defaults.units === "Metric" ? "kilograms" : "pieces"}><option>pieces</option><option>kilograms</option><option>grams</option><option>liters</option><option>milliliters</option><option>cans</option><option>packs</option><option>bunches</option></Select></div><Select label="Storage location"><option>Refrigerator</option>{locations.map((l) => <option key={l}>{l}</option>)}</Select><Input label="Expiration date (from packaging, if known)" type="date" /><p className="field-help">A food photo cannot reliably reveal its actual expiration date.</p></div>}</div>;
}

function AddItem({ role, gated, notify, navigate }: { role: Role; gated: (fn: () => void) => void; notify: (text: string) => void; navigate: (v: View) => void }) {
  const [name, setName] = useState("");
  const [defaults] = useState(() => {
    try { return { ...defaultSettings(role), ...JSON.parse(window.localStorage.getItem(`pantrylens-settings-${role}`) || "{}") } as SettingsData; }
    catch { return defaultSettings(role); }
  });
  const submit = (event: React.FormEvent) => { event.preventDefault(); gated(() => { notify(`${name || "Food item"} added to demo inventory`); navigate("inventory"); }); };
  return <>
    <PageHeader eyebrow="Inventory" title="Add food manually" description="Record an item with the details you know. You can update them anytime." />
    <form className="form-layout" onSubmit={submit}><Card className="form-card"><h2>Item information</h2><p>Fields marked required keep inventory quantities accurate.</p><Input label="Food name *" placeholder="e.g. Bangus" value={name} onChange={(e) => setName(e.target.value)} required /><Select label="Food category *" required><option value="">Select category</option>{categories.map((c) => <option key={c}>{c}</option>)}</Select><div className="split-fields"><Input label="Quantity *" type="number" min="0.01" step="0.01" required /><Select label="Unit *" defaultValue={defaults.units === "Metric" ? "kilograms" : "pieces"}><option>pieces</option><option>kilograms</option><option>grams</option><option>liters</option><option>milliliters</option><option>cans</option><option>packs</option><option>bunches</option></Select></div><Select label="Storage location *" defaultValue={defaults.storage}>{locations.map((l) => <option key={l}>{l}</option>)}</Select><div className="split-fields"><Input label="Purchase date" type="date" /><Input label="Expiration date" type="date" /></div><Input label="Minimum-stock threshold" type="number" min="0" defaultValue={defaults.lowStockDefault} /><label className="field"><span>Notes</span><textarea placeholder="Brand, packaging, or household notes" rows={4} /></label></Card><aside><Card className="image-upload-small"><ImagePlus /><h3>Add an item photo</h3><p>Optional. Images will use Supabase Storage after backend integration.</p><Button variant="secondary" onClick={() => notify("Image picker opened in demo mode")}>Choose image</Button></Card>{name.toLowerCase().includes("egg") && <Card className="duplicate-warning"><AlertTriangle /><div><b>Possible duplicate</b><p>Eggs already exists with 8 pcs in the refrigerator.</p><button type="button" onClick={() => navigate("inventory")}>Review existing item</button></div></Card>}<div className="sticky-actions"><Button variant="secondary" onClick={() => navigate("inventory")}>Cancel</Button><Button type="submit">Add to pantry</Button></div></aside></form>
  </>;
}

function Monitoring({ items, navigate, role, gated, notify }: { items: Item[]; navigate: (v: View) => void; role: Role; gated: (fn: () => void) => void; notify: (s: string) => void }) {
  const [tab, setTab] = useState<"soon" | "expired" | "low">("soon");
  const [sort, setSort] = useState("Most urgent");
  const alertDays = (() => {
    try { return (JSON.parse(window.localStorage.getItem(`pantrylens-settings-${role}`) || "{}") as Partial<SettingsData>).alertDays || "5"; }
    catch { return "5"; }
  })();
  const visible = items.filter((i) => tab === "soon" ? i.status === "Expiring soon" : tab === "expired" ? i.status === "Expired" : i.status === "Low stock").sort((a, b) => sort === "Name A–Z" ? a.name.localeCompare(b.name) : a.expiry.localeCompare(b.expiry));
  return <>
    <PageHeader eyebrow="Food monitoring" title="Keep food moving" description="Review freshness, stock levels, and recent usage in one place." actions={<Button variant="secondary" onClick={() => navigate("usage")}>View usage history</Button>} />
    <div className="monitor-summary"><Card onClick={() => setTab("soon")} className={tab === "soon" ? "active" : ""}><Clock3 /><span><b>{items.filter((i) => i.status === "Expiring soon").length}</b>Expiring soon</span></Card><Card onClick={() => setTab("expired")} className={tab === "expired" ? "active" : ""}><AlertTriangle /><span><b>{items.filter((i) => i.status === "Expired").length}</b>Expired items</span></Card><Card onClick={() => setTab("low")} className={tab === "low" ? "active" : ""}><TrendingDown /><span><b>{items.filter((i) => i.status === "Low stock").length}</b>Low stock</span></Card></div>
    <Card className="monitor-card"><div className="monitor-toolbar"><div className="tabs"><button className={tab === "soon" ? "active" : ""} onClick={() => setTab("soon")}>Expiring soon</button><button className={tab === "expired" ? "active" : ""} onClick={() => setTab("expired")}>Expired</button><button className={tab === "low" ? "active" : ""} onClick={() => setTab("low")}>Low stock</button></div><div><Select aria-label="Sort monitoring items" value={sort} onChange={(event) => setSort(event.target.value)}><option>Most urgent</option><option>Name A–Z</option></Select><Button variant="secondary" onClick={() => navigate("settings")} icon={<Settings size={16} />}>Alert: {alertDays} days</Button></div></div><div className="monitor-list">{visible.map((item) => <div key={item.id}><span className="item-emoji">{item.icon}</span><span><b>{item.name}</b><small>{item.category} · {item.location}</small></span><span><small>Quantity</small><b>{item.quantity} {item.unit}</b></span><span><small>{tab === "low" ? "Minimum" : "Expiration"}</small><b>{tab === "low" ? `2 ${item.unit}` : item.expiry}</b></span><StatusBadge status={item.status} /><Button variant="secondary" onClick={() => navigate("inventory")}>View item</Button></div>)}</div>{visible.length === 0 && <div className="empty-state compact"><CheckCircle2 /><h3>Nothing to review here</h3><p>Your pantry has no items in this state.</p></div>}</Card>
  </>;
}

function UsageHistory({ role, gated, notify }: { role: Role; gated: (fn: () => void) => void; notify: (s: string) => void }) {
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [itemFilter, setItemFilter] = useState("All items");
  const [memberFilter, setMemberFilter] = useState("All members");
  const [dateFilter, setDateFilter] = useState("");
  const history = [
    { time: "Today, 8:40 AM", date: "2026-09-08", item: "Eggs", change: "2 pcs consumed", member: "Maria Dela Cruz", note: "Breakfast", added: false },
    { time: "Sep 7, 6:12 PM", date: "2026-09-07", item: "Chicken thighs", change: "0.4 kg consumed", member: "Juan Dela Cruz", note: "Chicken adobo", added: false },
    { time: "Sep 6, 12:22 PM", date: "2026-09-06", item: "Rice", change: "0.5 kg consumed", member: "Juan Dela Cruz", note: "Weekly meal prep", added: false },
    { time: "Sep 5, 5:30 PM", date: "2026-09-05", item: "Pechay", change: "1 bunch added", member: "Maria Dela Cruz", note: "Grocery restock", added: true },
  ];
  const filteredHistory = history.filter((row) => `${row.item} ${row.note}`.toLowerCase().includes(query.toLowerCase()) && (itemFilter === "All items" || row.item === itemFilter) && (memberFilter === "All members" || row.member.startsWith(memberFilter)) && (!dateFilter || row.date === dateFilter));
  return <>
    <PageHeader eyebrow="Inventory audit" title="Food usage history" description="Track what changed, when it changed, and who recorded it." actions={<Button onClick={() => gated(() => setModal(true))} icon={<Minus size={17} />}>Record food usage</Button>} />
    <Card className="inventory-toolbar usage-filters"><Input aria-label="Search usage history" placeholder="Search usage…" value={query} onChange={(event) => setQuery(event.target.value)} icon={<Search size={18} />} /><Select aria-label="Filter usage by item" value={itemFilter} onChange={(event) => setItemFilter(event.target.value)}><option>All items</option><option>Eggs</option><option>Chicken thighs</option><option>Rice</option><option>Pechay</option></Select><Select aria-label="Filter usage by member" value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)}><option>All members</option><option>Juan</option><option>Maria</option></Select><Input aria-label="Filter usage by date" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} /></Card>
    <Card className="timeline-card">{filteredHistory.map((row) => <div className="history-row" key={row.time}><span className={row.added ? "add" : "consume"}>{row.added ? <Plus /> : <Minus />}</span><div><small>{row.time}</small><h3>{row.item}</h3><p>{row.change} · {row.note}</p></div><div><small>Recorded by</small><b>{row.member}</b></div><button aria-label={`View ${row.item} history details`} onClick={() => notify(`${row.item} history detail opened`)}><ChevronRight /></button></div>)}{filteredHistory.length === 0 && <div className="empty-state compact"><CheckCircle2 /><h3>Nothing to review here</h3><p>Your pantry has no items in this state.</p></div>}</Card>
    {modal && <Modal title="Record food usage" onClose={() => setModal(false)}><form className="form-stack" onSubmit={(e) => { e.preventDefault(); setModal(false); notify("Usage recorded; quantity updated in demo"); }}><Select label="Food item *"><option>Eggs · 8 pcs available</option><option>Chicken thighs · 1.2 kg available</option></Select><div className="split-fields"><Input label="Quantity used *" type="number" min="0.01" max="8" required /><Select label="Unit"><option>pcs</option><option>kg</option></Select></div><Input label="Usage date *" type="date" required /><Select label="Used by"><option>Current user — Juan</option><option>Maria Dela Cruz</option></Select><Input label="Notes" placeholder="e.g. Breakfast" /><p className="field-help">PantryLens prevents usage from reducing available quantity below zero.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button type="submit">Record usage</Button></div></form></Modal>}
  </>;
}

function Recipes({ navigate, role, gated, notify }: { navigate: (v: View) => void; role: Role; gated: (fn: () => void) => void; notify: (s: string) => void }) {
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState("Any meal type");
  const [prep, setPrep] = useState("Any prep time");
  const [difficulty, setDifficulty] = useState("Any difficulty");
  const [pantryMatches, setPantryMatches] = useState(false);
  const filtered = recipes.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) && (meal === "Any meal type" || r.meal === meal) && (prep === "Any prep time" || parseInt(r.time) <= +(prep.match(/\d+/)?.[0] || 999)) && (difficulty === "Any difficulty" || r.level === difficulty) && (!pantryMatches || r.match >= 75));
  return <>
    <PageHeader eyebrow="Recipe discovery" title="What can we cook?" description="Recommendations compare required ingredients against authorized available inventory." actions={<Button variant="secondary" onClick={() => notify("Showing saved recipe preview")} icon={<Heart size={17} />}>Saved recipes</Button>} />
    <Card className="recipe-hero-card"><div><Badge tone="success"><Sparkles size={14} /> Top pantry match</Badge><h2>Chicken Adobo</h2><p>You already have 4 of 5 required ingredients. Add bay leaves and dinner is sorted.</p><div className="recipe-stats"><span><Clock3 /> <b>15 min</b><small>Prep</small></span><span><Zap /> <b>30 min</b><small>Cook</small></span><span><Utensils /> <b>Easy</b><small>Difficulty</small></span></div><div className="hero-actions"><Button onClick={() => gated(() => notify("Chicken Adobo saved"))} icon={<Heart size={17} />}>Save recipe</Button><Button variant="secondary" onClick={() => notify("Print preview is ready")} icon={<FileText size={17} />}>Print</Button></div></div></Card>
    <Card className="recipe-filters"><Input aria-label="Search recipes" placeholder="Search Filipino recipes…" value={query} onChange={(e) => setQuery(e.target.value)} icon={<Search size={18} />} /><Select aria-label="Filter recipes by meal type" value={meal} onChange={(event) => setMeal(event.target.value)}><option>Any meal type</option><option>Dinner</option><option>Lunch</option><option>Breakfast</option></Select><Select aria-label="Filter recipes by preparation time" value={prep} onChange={(event) => setPrep(event.target.value)}><option>Any prep time</option><option>Under 30 min</option><option>Under 60 min</option></Select><Select aria-label="Filter recipes by difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>Any difficulty</option><option>Easy</option><option>Medium</option></Select><Button variant={pantryMatches ? "soft" : "secondary"} onClick={() => setPantryMatches(!pantryMatches)} icon={<Filter size={16} />}>{pantryMatches ? "Pantry matches on" : "Pantry matches only"}</Button></Card>
    <div className="recipe-grid">{filtered.map((recipe) => <article key={recipe.id} className="recipe-card"><div className="recipe-img"><img src={recipe.image} alt={recipe.name} /><div className="match-ring">{recipe.match}<small>%</small></div><button aria-label={`Save ${recipe.name}`} onClick={() => gated(() => notify(`${recipe.name} saved to favorites`))}><Heart size={17} /></button></div><div><div className="recipe-kicker"><Badge tone={recipe.match > 85 ? "success" : "warning"}>{recipe.match > 85 ? "Great match" : "Good match"}</Badge><span><Clock3 size={14} />{recipe.time}</span></div><h2>{recipe.name}</h2><p>{recipe.description}</p><div className="ingredient-summary"><span className="have"><Check size={14} /> {recipe.available.length} available</span><span className="missing"><Plus size={14} /> {recipe.missing.length} missing</span></div><Button variant="secondary" onClick={() => navigate("recipe")}>View recipe <ChevronRight size={16} /></Button></div></article>)}</div>
    {filtered.length === 0 && <Card className="empty-state"><Search /><h2>No recipes match these filters</h2><p>Try a different meal, preparation time, or pantry match.</p><Button variant="secondary" onClick={() => { setQuery(""); setMeal("Any meal type"); setPrep("Any prep time"); setDifficulty("Any difficulty"); setPantryMatches(false); }}>Clear filters</Button></Card>}
    <Card className="disclaimer"><CircleHelp size={19} /><p>Sample recipes are for planning inspiration and are not verified nutritional or medical recommendations. Ingredient availability is based on demo data.</p></Card>
  </>;
}

function RecipeDetail({ navigate, role, gated, notify }: { navigate: (v: View) => void; role: Role; gated: (fn: () => void) => void; notify: (s: string) => void }) {
  const [servings, setServings] = useState(() => {
    try { return Math.max(1, Math.min(20, +(JSON.parse(window.localStorage.getItem(`pantrylens-settings-${role}`) || "{}") as Partial<SettingsData>).servings! || 4)); }
    catch { return 4; }
  });
  return <>
    <button className="back-link" onClick={() => navigate("recipes")}><ArrowLeft size={17} /> Back to recipes</button>
    <div className="recipe-detail-hero"><img src={RECIPE_IMAGES[0]} alt="Chicken Adobo" /><div><Badge tone="success">92% pantry match</Badge><h1>Chicken Adobo</h1><p>A comforting Filipino classic simmered in a tangy-savory sauce of soy, vinegar, and plenty of garlic.</p><div className="recipe-stats"><span><Clock3 /> <b>15 min</b><small>Prep</small></span><span><Zap /> <b>30 min</b><small>Cook</small></span><span><Utensils /> <b>Easy</b><small>Difficulty</small></span></div><div className="hero-actions"><Button onClick={() => gated(() => notify("Chicken Adobo saved"))} icon={<Heart size={17} />}>Save recipe</Button><Button variant="secondary" onClick={() => notify("Print preview is ready")} icon={<FileText size={17} />}>Print</Button></div></div></div>
    <div className="recipe-detail-grid"><Card><div className="card-heading"><div><h2>Ingredients</h2><p>Required ingredients drive the 92% match score.</p></div><div className="servings"><button onClick={() => setServings(Math.max(1, servings - 1))}><Minus /></button><span><b>{servings}</b> servings</span><button onClick={() => setServings(servings + 1)}><Plus /></button></div></div><h3 className="ingredient-section-title"><CheckCircle2 /> Available in your pantry</h3>{["Chicken thighs|1 kg|1.2 kg available", "Garlic|6 cloves|1 head available", "Soy sauce|½ cup|1 bottle available", "Vinegar|⅓ cup|1 bottle available"].map((item) => { const [name, qty, stock] = item.split("|"); return <div className="ingredient-row have" key={name}><Check /><span><b>{name}</b><small>{stock}</small></span><strong>{qty}</strong></div>; })}<h3 className="ingredient-section-title missing"><ShoppingBasket /> Missing required ingredients</h3><div className="ingredient-row missing"><Plus /><span><b>Bay leaves</b><small>Not found in pantry</small></span><strong>3 leaves</strong></div><h3 className="ingredient-section-title optional"><CircleHelp /> Optional</h3><div className="ingredient-row"><span className="empty-check" /><span><b>Black peppercorns</b><small>Optional, excluded from match score</small></span><strong>1 tsp</strong></div><Button className="full-button" onClick={() => gated(() => { notify("Bay leaves added to shopping list"); navigate("shopping"); })} icon={<ShoppingBasket size={17} />}>Add missing to shopping list</Button></Card><Card><h2>Cooking instructions</h2><p className="card-intro">Follow each step and adjust seasoning to your household’s preference.</p>{["Combine chicken, soy sauce, and half the garlic. Marinate for 15 minutes.", "Brown the chicken in a heavy pan, then set it aside.", "Add vinegar, remaining marinade, bay leaves, peppercorns, and 1 cup water.", "Return chicken to the pan. Simmer uncovered for 25 minutes until tender.", "Reduce the sauce to your preferred consistency and serve with warm rice."].map((step, i) => <div className="instruction" key={step}><span>{i + 1}</span><p>{step}</p></div>)}<div className="cook-note"><b>PantryLens tip</b><p>Log the chicken and garlic you use afterward to keep inventory accurate.</p><Button variant="secondary" onClick={() => navigate("usage")}>Record ingredients used</Button></div></Card></div>
  </>;
}

function ShoppingList({ role, gated, notify }: { role: Role; gated: (fn: () => void) => void; notify: (s: string) => void }) {
  const [items, setItems] = useState([{ id: 1, name: "Bay leaves", qty: "1 pack", bought: false, source: "Chicken Adobo" }, { id: 2, name: "Mung beans", qty: "500 g", bought: false, source: "Ginisang Monggo" }, { id: 3, name: "Ginger", qty: "1 piece", bought: true, source: "Chicken Tinola" }, { id: 4, name: "Dish soap", qty: "1 bottle", bought: false, source: "Added manually" }]);
  const [filter, setFilter] = useState("All");
  const visible = items.filter((i) => filter === "All" || (filter === "To buy" ? !i.bought : i.bought));
  return <>
    <PageHeader eyebrow="Plan ahead" title="Shopping list" description="Recipe needs and household essentials, checked against your pantry." actions={<Button onClick={() => gated(() => notify("Manual shopping item added"))} icon={<Plus size={17} />}>Add item</Button>} />
    <div className="shopping-layout"><Card><div className="shopping-head"><div className="tabs"><button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>All {items.length}</button><button className={filter === "To buy" ? "active" : ""} onClick={() => setFilter("To buy")}>To buy {items.filter((i) => !i.bought).length}</button><button className={filter === "Purchased" ? "active" : ""} onClick={() => setFilter("Purchased")}>Purchased {items.filter((i) => i.bought).length}</button></div><Button variant="ghost" onClick={() => gated(() => setItems(items.filter((i) => !i.bought)))}>Clear purchased</Button></div><div className="shopping-items">{visible.map((item) => <div key={item.id} className={item.bought ? "purchased" : ""}><button className="check-button" onClick={() => gated(() => setItems(items.map((i) => i.id === item.id ? { ...i, bought: !i.bought } : i)))}>{item.bought && <Check />}</button><span><b>{item.name}</b><small>{item.source}</small></span><strong>{item.qty}</strong><button onClick={() => gated(() => setItems(items.filter((i) => i.id !== item.id)))} aria-label={`Remove ${item.name}`}><Trash2 /></button></div>)}</div></Card><aside><Card className="pantry-check"><h2>Pantry check</h2><p>PantryLens found a related item already at home.</p><div><span className="food-initial">GA</span><span><b>Garlic</b><small>1 head available · low stock</small></span></div></Card><Card className="info-banner vertical"><CircleHelp /><div><b>Purchased isn’t stocked yet</b><p>After shopping, confirm quantity, storage location, and dates before adding purchased items to inventory.</p></div><Button variant="secondary" onClick={() => gated(() => notify("Purchased item confirmation opened"))}>Review purchased items</Button></Card></aside></div>
  </>;
}

function Household({ role, workspace, setWorkspace, gated, notify, navigate }: { role: Role; workspace: Workspace; setWorkspace: (workspace: Workspace) => void; gated: (fn: () => void) => void; notify: (s: string) => void; navigate: (v: View) => void }) {
  const [invite, setInvite] = useState(false);
  const [create, setCreate] = useState(false);
  const [leave, setLeave] = useState(false);
  if (role === "member") return <>
    <PageHeader eyebrow="Household membership" title="Dela Cruz Home" description="Your personal account remains separate from the records shared with you." actions={<Button variant="danger" onClick={() => setLeave(true)}>Leave household</Button>} />
    <Card className="household-hero"><div className="household-avatar">DC</div><div><Badge tone="info">Household member</Badge><h2>Dela Cruz Home</h2><p>Joined August 28, 2026 · Relationship label: Partner</p></div><Button variant="secondary" onClick={() => navigate("shared")}>Open shared pantry</Button></Card>
    <div className="household-grid"><Card><div className="card-heading"><div><h2>Your permissions</h2><p>Permissions come from household membership, not the relationship label.</p></div></div><div className="permission-list"><span><CheckCircle2 /> View shared inventory</span><span><CheckCircle2 /> Record food usage</span><span><CheckCircle2 /> Update 3 assigned records</span><span className="muted"><X /> Delete items or manage members</span></div></Card><Card><div className="card-heading"><div><h2>Assigned inventory</h2><p>Records the household owner has authorized you to update.</p></div><Badge tone="info">3 assigned</Badge></div>{[["EG", "Eggplant", "3 pcs"], ["CH", "Chicken thighs", "1.2 kg"], ["EE", "Eggs", "8 pcs"]].map((item) => <div className="assigned-row" key={item[1]}><span>{item[0]}</span><div><b>{item[1]}</b><small>{item[2]} · Update permitted</small></div><Button variant="ghost" onClick={() => navigate("shared")}>View</Button></div>)}</Card></div>
    <Card className="info-banner"><ShieldCheck size={20} /><div><b>Authorization boundary</b><p>The interface hides owner-only actions. Production access to shared and assigned records must also be enforced with authenticated membership checks and database row-level policies.</p></div></Card>
    {leave && <Modal title="Leave Dela Cruz Home?" onClose={() => setLeave(false)}><div className="warning-box"><AlertTriangle /><p>You will lose access to shared inventory and assigned records. Your personal pantry will not be deleted or transferred.</p></div><div className="modal-actions"><Button variant="secondary" onClick={() => setLeave(false)}>Cancel</Button><Button variant="danger" onClick={() => { setLeave(false); notify("Leave request simulated; backend membership was not changed"); navigate("dashboard"); }}>Leave household</Button></div></Modal>}
  </>;
  if (workspace === "personal") return <>
    <PageHeader eyebrow="Personal workspace" title="You’re working independently" description="Your personal pantry is private. Create a household only when you’re ready to share selected records." actions={<Button onClick={() => gated(() => setCreate(true))} icon={<Users size={17} />}>Create household</Button>} />
    <Card className="standalone-card"><div className="standalone-icon"><User /></div><div><Badge tone="success">Personal pantry active</Badge><h2>Juan’s personal pantry</h2><p>Add, scan, monitor, and cook from your own inventory without creating or joining a household.</p><div className="hero-actions"><Button onClick={() => navigate("inventory")}>Open personal pantry</Button><Button variant="secondary" onClick={() => gated(() => setCreate(true))}>Share with a new household</Button></div></div></Card>
    <div className="household-grid"><Card className="household-setting"><span><ShieldCheck /></span><div><h3>Private by default</h3><p>No personal inventory is transferred or merged when you create or join a household.</p></div></Card><Card className="household-setting"><span><UserPlus /></span><div><h3>Have an invitation?</h3><p>Validate a household code, then explicitly choose what remains personal.</p></div><Button variant="secondary" onClick={() => gated(() => notify("Join-household review opened"))}>Join with code</Button></Card></div>
    {create && <Modal title="Create a household" onClose={() => setCreate(false)}><form className="form-stack" onSubmit={(event) => { event.preventDefault(); setCreate(false); setWorkspace("household"); notify("Demo household created; personal inventory remained separate"); }}><Input label="Household name *" placeholder="e.g. Dela Cruz Home" required /><Input label="Description" placeholder="Optional household description" /><div className="auth-note"><ShieldCheck size={16} />Creating a household does not merge or transfer your personal inventory. Sharing is configured per record.</div><div className="modal-actions"><Button variant="secondary" onClick={() => setCreate(false)}>Cancel</Button><Button type="submit">Create household</Button></div></form></Modal>}
  </>;
  return <>
    <PageHeader eyebrow="Shared household" title="Dela Cruz Home" description="Share selected pantry records while keeping personal inventory separate." actions={<Button onClick={() => gated(() => setInvite(true))} icon={<UserPlus size={17} />}>Invite member</Button>} />
    <Card className="household-hero"><div className="household-avatar">DC</div><div><Badge tone="success">You are the owner</Badge><h2>Dela Cruz Home</h2><p>Family pantry for our Quezon City home · 3 active members</p></div><div className="invite-code"><small>Invitation code</small><b>DELA-2841</b><Button variant="secondary" onClick={() => gated(() => notify("Invitation code copied"))}>Copy code</Button></div></Card>
    <div className="household-grid"><Card><div className="card-heading"><div><h2>Household members</h2><p>Relationship labels do not grant permissions.</p></div><Badge>3 active</Badge></div>{[["MD", "Maria Dela Cruz", "Partner", "Can update shared items"], ["AD", "Ana Dela Cruz", "Family", "3 assigned records"], ["PD", "Paolo Dela Cruz", "Family", "View and record usage"]].map((member, i) => <div className="member-row" key={member[1]}><span>{member[0]}</span><div><b>{member[1]}</b><small>{member[2]} · {member[3]}</small></div><Badge tone={i === 0 ? "success" : "neutral"}>{i === 0 ? "Co-manager" : "Member"}</Badge><button aria-label={`Manage ${member[1]}`} onClick={() => gated(() => notify("Member permission controls opened"))}><MoreHorizontal /></button></div>)}</Card><Card><h2>Pending invitations</h2><p className="card-intro">Email delivery requires backend configuration.</p><div className="pending-invite"><span>RJ</span><div><b>rosa@example.com</b><small>Friend · expires in 5 days</small></div><Badge tone="warning">Pending</Badge></div><div className="pending-invite"><span>KM</span><div><b>Invite code request</b><small>Requested by Kai Mendoza</small></div><div><Button variant="soft" onClick={() => gated(() => notify("Invitation accepted"))}>Accept</Button><Button variant="ghost" onClick={() => gated(() => notify("Invitation declined"))}>Decline</Button></div></div></Card></div>
    <div className="household-grid"><Card className="household-setting"><span><Warehouse /></span><div><h3>Shared inventory</h3><p>28 items are visible to household members; 3 are assigned to Ana.</p></div><Button variant="secondary" onClick={() => navigate("shared")}>Manage access</Button></Card><Card className="household-setting"><span><ShieldCheck /></span><div><h3>Sharing permissions</h3><p>Members can view, record usage, and edit assigned records only.</p></div><Button variant="secondary" onClick={() => gated(() => navigate("settings"))}>Configure</Button></Card></div>
    <Card className="join-card"><div><h2>Joining another household?</h2><p>Use an invitation code. PantryLens will ask whether you want to keep personal inventory separate—nothing is merged automatically.</p></div><Input placeholder="Enter invitation code" /><Button onClick={() => gated(() => notify("Invitation code validated in demo"))}>Check code</Button></Card>
    {invite && <Modal title="Invite a household member" onClose={() => setInvite(false)}><form className="form-stack" onSubmit={(e) => { e.preventDefault(); setInvite(false); notify("Demo invitation created; no email was sent"); }}><Input label="Email address" type="email" required placeholder="member@example.com" /><Select label="Relationship label"><option>Family</option><option>Friend</option><option>Partner</option><option>Other</option></Select><Select label="Initial permission"><option>View and record usage</option><option>Update assigned records</option><option>Household co-manager</option></Select><div className="auth-note"><CircleHelp size={16} />This prototype records a simulated invitation only. It does not send email.</div><div className="modal-actions"><Button variant="secondary" onClick={() => setInvite(false)}>Cancel</Button><Button type="submit">Create invitation</Button></div></form></Modal>}
  </>;
}

function Notifications({ count, setCount, role, gated }: { count: number; setCount: (n: number) => void; role: Role; gated: (fn: () => void) => void }) {
  const [filter, setFilter] = useState("All");
  const notificationRows = [
    { tone: "warning", category: "Pantry", title: "Eggplant expires soon", detail: "Use 3 eggplants before September 9. Tortang Talong is an 88% match.", time: "12 minutes ago" },
    { tone: "danger", category: "Pantry", title: "Tomatoes are expired", detail: "Review 2 tomatoes in your refrigerator. Expired items are never removed automatically.", time: "2 hours ago" },
    { tone: "success", category: "Pantry", title: "Demo scan completed", detail: "2 food items were recognized and are ready for your review.", time: "Yesterday" },
    { tone: "info", category: "Household", title: "Maria updated shared inventory", detail: "2 eggs were recorded as consumed from Dela Cruz Home.", time: "Yesterday" },
    { tone: "neutral", category: "Account", title: "New sign-in to your demo account", detail: "Chrome on macOS · Quezon City · simulated security event", time: "Sep 6" },
  ];
  const visibleNotifications = notificationRows.filter((row, index) => filter === "All" || filter === row.category || (filter === "Unread" && index < count));
  return <>
    <PageHeader eyebrow="Stay informed" title="Notifications" description="In-app alerts for inventory, households, recognition, and account activity." actions={<Button variant="secondary" onClick={() => gated(() => setCount(0))} icon={<Check size={17} />}>Mark all as read</Button>} />
    <Card className="notification-card"><div className="tabs notification-tabs">{["All", "Unread", "Pantry", "Household", "Account"].map((tab) => <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab}</button>)}</div>{visibleNotifications.map((row) => { const originalIndex = notificationRows.indexOf(row); return <button className={`notification-row ${originalIndex < count ? "unread" : ""}`} key={row.title} onClick={() => gated(() => setCount(Math.max(0, count - 1)))}><span className={`notification-icon ${row.tone}`}>{row.tone === "warning" ? <Clock3 /> : row.tone === "danger" ? <AlertTriangle /> : row.tone === "success" ? <CheckCircle2 /> : row.tone === "info" ? <Users /> : <ShieldCheck />}</span><span><b>{row.title}</b><p>{row.detail}</p><small>{row.time}</small></span>{originalIndex < count && <i />}</button>; })}{visibleNotifications.length === 0 && <div className="empty-state compact"><CheckCircle2 /><h3>No notifications here</h3><p>Try another filter or check back later.</p></div>}</Card><Card className="disclaimer"><Bell size={19} /><p>These are prototype in-app notifications. Email, push, and background delivery require verified backend scheduling and provider configuration.</p></Card>
  </>;
}

type SettingsData = {
  fullName: string; email: string; photoName: string;
  theme: "Light" | "Dark" | "System"; density: "Comfortable" | "Compact";
  contrast: boolean; largeText: boolean; reduceMotion: boolean;
  expirationAlerts: boolean; lowStockAlerts: boolean; householdAlerts: boolean; productUpdates: boolean; emailAlerts: boolean; pushAlerts: boolean; alertDays: string;
  storage: string; units: string; reminderDays: string; lowStockDefault: string; inventorySort: string;
  cuisines: string; mealType: string; prepTime: string; dietary: string; servings: string;
  householdName: string; householdDescription: string; codeInvites: boolean; memberUsage: boolean; assignedEdits: boolean;
  profileVisibility: string; analytics: boolean; recognitionImages: boolean;
  adminName: string; adminEmail: string; recognitionAdapter: string; confirmRecognition: boolean;
  defaultReport: string; exportFormat: string; excludeIdentifiers: boolean; requireAdminReason: boolean; auditRetention: string;
};

function defaultSettings(role: Role): SettingsData {
  return {
    fullName: role === "member" ? "Maria Dela Cruz" : "Juan Dela Cruz", email: role === "member" ? "maria@pantrylens.app" : "demo@pantrylens.app", photoName: "",
    theme: "Light", density: "Comfortable", contrast: false, largeText: false, reduceMotion: false,
    expirationAlerts: true, lowStockAlerts: true, householdAlerts: true, productUpdates: false, emailAlerts: false, pushAlerts: false, alertDays: "5",
    storage: "Refrigerator", units: "Metric", reminderDays: "5", lowStockDefault: "1", inventorySort: "Expiration date",
    cuisines: "Filipino, Asian", mealType: "Any meal", prepTime: "Under 60 minutes", dietary: "", servings: "4",
    householdName: "Dela Cruz Home", householdDescription: "Family pantry for our Quezon City home", codeInvites: true, memberUsage: true, assignedEdits: true,
    profileVisibility: "Household members only", analytics: false, recognitionImages: false,
    adminName: "System Admin", adminEmail: "admin@pantrylens.app", recognitionAdapter: "Demo adapter", confirmRecognition: true,
    defaultReport: "Registered users", exportFormat: "CSV", excludeIdentifiers: true, requireAdminReason: true, auditRetention: "180",
  };
}


function SettingsPage({
  role,
  workspace,
  gated,
  notify,
  user,
}: {
  role: Role;
  workspace: Workspace;
  gated: (fn: () => void) => void;
  notify: (s: string) => void;
  user: {
    id: string;
    email?: string;
    created_at?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
  } | null;
}) {

  const storageKey = `pantrylens-settings-${role}`;
  
  const accountName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";

  const accountEmail = user?.email || "";

  const accountInitials = accountName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const accountCreated = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unavailable";

  const loadSettings = () => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored ? { ...defaultSettings(role), ...JSON.parse(stored) } as SettingsData : defaultSettings(role);
    } catch { return defaultSettings(role); }
  };
  const [saved, setSaved] = useState<SettingsData>(loadSettings);
  const [draft, setDraft] = useState<SettingsData>(saved);
  const [section, setSection] = useState(role === "admin" ? "Admin profile" : "Account");
  const [error, setError] = useState("");
  const [infoTopic, setInfoTopic] = useState("About");
  const [dialog, setDialog] = useState<"password" | "sessions" | "delete" | null>(null);
  const [dialogError, setDialogError] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [deleteText, setDeleteText] = useState("");
  const [statusChecked, setStatusChecked] = useState("Not checked");
  const photoRef = useRef<HTMLInputElement>(null);
  const adminSections = ["Admin profile", "Recognition", "Reports", "Security & audit", "System information"];
  const userSections = ["Account", "Appearance", "Accessibility", "Notifications", "Pantry", "Recipes", ...(role === "owner" && workspace === "household" ? ["Household"] : []), ...(role === "member" ? ["Household access"] : []), "Privacy", "Security", "Application information"];
  const sections = role === "admin" ? adminSections : userSections;
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const update = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => { setDraft((current) => ({ ...current, [key]: value })); setError(""); };

  useEffect(() => {
    const root = document.documentElement;
    const resolvedTheme = draft.theme === "System" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light" : draft.theme;
    root.dataset.theme = resolvedTheme.toLowerCase();
    root.dataset.density = draft.density.toLowerCase();
    root.dataset.contrast = draft.contrast ? "high" : "normal";
    root.dataset.largeText = draft.largeText ? "true" : "false";
    root.dataset.reduceMotion = draft.reduceMotion ? "true" : "false";
  }, [draft.theme, draft.density, draft.contrast, draft.largeText, draft.reduceMotion]);

  const validate = () => {
    if ((section === "Account" && (!draft.fullName.trim() || !/^\S+@\S+\.\S+$/.test(draft.email))) || (section === "Admin profile" && (!draft.adminName.trim() || !/^\S+@\S+\.\S+$/.test(draft.adminEmail)))) return "Enter a name and a valid email address.";
    if (section === "Pantry" && (+draft.reminderDays < 0 || +draft.reminderDays > 365 || +draft.lowStockDefault < 0)) return "Pantry defaults must be zero or greater; reminder days cannot exceed 365.";
    if (section === "Recipes" && (+draft.servings < 1 || +draft.servings > 20)) return "Default serving size must be between 1 and 20.";
    if (section === "Household" && !draft.householdName.trim()) return "Household name is required.";
    if (section === "Security & audit" && (+draft.auditRetention < 30 || +draft.auditRetention > 2555)) return "Audit retention must be between 30 days and 7 years.";
    return "";
  };
  const save = () => gated(() => {
    const validation = validate();
    if (validation) { setError(validation); return; }
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
    setSaved(draft);
    if ((section === "Account" && draft.email !== saved.email) || (section === "Admin profile" && draft.adminEmail !== saved.adminEmail)) notify("Preferences saved locally. Email verification still requires Supabase Auth; no email was sent.");
    else if ((section === "Notifications" && (draft.emailAlerts || draft.pushAlerts))) notify("In-app preferences saved. Email and push delivery remain unavailable until backend providers are connected.");
    else notify(`${section} settings saved on this device`);
  });
  const cancel = () => { setDraft(saved); setError(""); notify("Unsaved settings restored"); };
  const selectSection = (next: string) => { setSection(next); setError(""); };
  const exportData = () => {
    const payload = JSON.stringify({ profile: { name: saved.fullName, email: saved.email }, preferences: saved, notice: "Demo export only; production export requires authenticated backend retrieval." }, null, 2);
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([payload], { type: "application/json" })); link.download = "pantrylens-demo-data.json"; link.click(); URL.revokeObjectURL(link.href); notify("Local demo data exported");
  };
  const handlePhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { setError("Choose a JPG or PNG image smaller than 5 MB."); return; }
    update("photoName", file.name); notify("Profile photo selected locally; cloud upload requires Supabase Storage.");
  };

  return <>
    <PageHeader eyebrow={role === "admin" ? "Protected administration" : "Preferences"} title={role === "admin" ? "Administrator settings" : "Settings"} description={role === "admin" ? "Configure administrative preferences without exposing household-private data." : "Saved preferences persist on this device; backend-dependent features are clearly marked."} />
    <div className="settings-layout"><aside className="settings-nav">{sections.map((item) => <button className={section === item ? "active" : ""} onClick={() => selectSection(item)} key={item}>{item}<ChevronRight size={16} /></button>)}</aside><Card className="settings-content">
      {section === "Account" && <SettingsSection title="Account and profile" description="Update personal details. Email and password changes require secure identity verification."><div className="profile-photo-row"><span>{accountInitials || "U"}</span><div><b>Profile photo</b><p>{draft.photoName || "JPG or PNG, up to 5 MB"}</p></div><input ref={photoRef} className="visually-hidden" type="file" accept="image/png,image/jpeg" onChange={(event) => handlePhoto(event.target.files?.[0])} /><Button variant="secondary" onClick={() => gated(() => photoRef.current?.click())}>Choose photo</Button></div><Input
  label="Full name *"
  value={accountName}
  disabled
/><Input
  label="Email address *"
  type="email"
  value={accountEmail}
  disabled
/><BackendNotice text="Changing email requires a verification message from Supabase Auth. This prototype saves only the preference and does not send email." /><div className="split-fields"><Input
  label="Account created"
  value={accountCreated}
  disabled
/><Button variant="secondary" onClick={() => gated(() => { setDialogError(""); setDialog("password"); })}>Change password</Button></div></SettingsSection>}
      {section === "Appearance" && <SettingsSection title="Appearance" description="Theme and density preview immediately. Save to keep them on this device."><OptionCards options={[["Light", Sun], ["Dark", Moon], ["System", Settings]]} active={draft.theme} onChange={(value) => update("theme", value as SettingsData["theme"])} /><Select label="Interface density" value={draft.density} onChange={(event) => update("density", event.target.value as SettingsData["density"])}><option>Comfortable</option><option>Compact</option></Select><div className="settings-preview"><span className="preview-swatch" /><div><b>Live interface preview</b><p>Cards, controls, spacing, and contrast update before saving. Cancel restores the saved appearance.</p></div></div></SettingsSection>}
      {section === "Accessibility" && <SettingsSection title="Accessibility" description="Adjust readability and motion while preserving keyboard navigation."><SettingToggle label="Enhanced contrast" detail="Increase borders and text separation." checked={draft.contrast} onChange={(value) => update("contrast", value)} /><SettingToggle label="Larger interface text" detail="Increase the base text scale throughout the application." checked={draft.largeText} onChange={(value) => update("largeText", value)} /><SettingToggle label="Reduce motion" detail="Disable nonessential transitions and animations." checked={draft.reduceMotion} onChange={(value) => update("reduceMotion", value)} /><div className="auth-note"><CircleHelp size={16} />These preferences apply locally. Operating-system and browser accessibility settings continue to take priority.</div></SettingsSection>}
      {section === "Notifications" && <SettingsSection title="Notification preferences" description="In-app preferences work locally. External delivery requires configured providers."><SettingToggle label="Expiration alerts" detail="Show in-app alerts before food expires." checked={draft.expirationAlerts} onChange={(value) => update("expirationAlerts", value)} /><SettingToggle label="Low-stock alerts" detail="Show in-app alerts at saved thresholds." checked={draft.lowStockAlerts} onChange={(value) => update("lowStockAlerts", value)} /><SettingToggle label="Household updates" detail="Show invitations, assignments, and shared-inventory changes." checked={draft.householdAlerts} onChange={(value) => update("householdAlerts", value)} /><SettingToggle label="Recipe and product updates" detail="Optional PantryLens news and recipe suggestions." checked={draft.productUpdates} onChange={(value) => update("productUpdates", value)} /><SettingToggle label="Email delivery" detail="Requires a verified email provider and background scheduler." checked={draft.emailAlerts} onChange={(value) => update("emailAlerts", value)} backend /><SettingToggle label="Push delivery" detail="Requires browser permission, service workers, and a push provider." checked={draft.pushAlerts} onChange={(value) => update("pushAlerts", value)} backend /><Select label="Expiration alert timing" value={draft.alertDays} onChange={(event) => update("alertDays", event.target.value)}><option value="3">3 days before</option><option value="5">5 days before</option><option value="7">7 days before</option></Select></SettingsSection>}
      {section === "Pantry" && <SettingsSection title="Pantry preferences" description="These saved defaults are ready for future inventory forms."><Select label="Default storage location" value={draft.storage} onChange={(event) => update("storage", event.target.value)}>{locations.map((location) => <option key={location}>{location}</option>)}</Select><Select label="Preferred units" value={draft.units} onChange={(event) => update("units", event.target.value)}><option value="Metric">Metric — kg, g, L, mL</option><option value="Household">Household units — pieces, cups, packs</option></Select><div className="split-fields"><Input label="Default reminder days" type="number" min="0" max="365" value={draft.reminderDays} onChange={(event) => update("reminderDays", event.target.value)} /><Input label="Default low-stock threshold" type="number" min="0" value={draft.lowStockDefault} onChange={(event) => update("lowStockDefault", event.target.value)} /></div><Select label="Default inventory sorting" value={draft.inventorySort} onChange={(event) => update("inventorySort", event.target.value)}><option>Expiration date</option><option>Recently added</option><option>Name</option><option>Quantity</option></Select></SettingsSection>}
      {section === "Recipes" && <SettingsSection title="Recipe preferences" description="Tune future recommendations; these preferences are not medical advice."><Input label="Favorite cuisines" value={draft.cuisines} onChange={(event) => update("cuisines", event.target.value)} /><Select label="Preferred meal type" value={draft.mealType} onChange={(event) => update("mealType", event.target.value)}><option>Any meal</option><option>Dinner</option><option>Lunch</option><option>Breakfast</option></Select><Select label="Preparation time" value={draft.prepTime} onChange={(event) => update("prepTime", event.target.value)}><option>Under 30 minutes</option><option>Under 60 minutes</option><option>Any duration</option></Select><Input label="Dietary preferences" value={draft.dietary} onChange={(event) => update("dietary", event.target.value)} placeholder="Optional, e.g. pescatarian" /><Input label="Default serving size" type="number" min="1" max="20" value={draft.servings} onChange={(event) => update("servings", event.target.value)} /></SettingsSection>}
      {section === "Household" && role === "owner" && workspace === "household" && <SettingsSection title="Household settings" description="Only household owners can configure these shared-workspace defaults."><Input label="Household name *" value={draft.householdName} onChange={(event) => update("householdName", event.target.value)} /><Input label="Description" value={draft.householdDescription} onChange={(event) => update("householdDescription", event.target.value)} /><SettingToggle label="Allow code-based invitations" detail="Invitation validation and expiry require backend enforcement." checked={draft.codeInvites} onChange={(value) => update("codeInvites", value)} backend /><SettingToggle label="Members can record usage" detail="Applies only to inventory shared with the member." checked={draft.memberUsage} onChange={(value) => update("memberUsage", value)} /><SettingToggle label="Members can edit assigned records" detail="Members cannot edit unassigned records." checked={draft.assignedEdits} onChange={(value) => update("assignedEdits", value)} /><BackendNotice text="Membership, ownership, invitations, and record assignments must be enforced with authenticated database policies." /></SettingsSection>}
      {section === "Household access" && <SettingsSection title="Household access" description="Membership details are view-only for household members."><div className="security-session"><Users /><div><b>Dela Cruz Home</b><p>View shared items, record usage, update 3 assigned records</p></div><Badge tone="info">Member</Badge></div><BackendNotice text="Only the household owner can change assignments or permissions. Membership changes require backend authorization." /></SettingsSection>}
      {section === "Privacy" && <SettingsSection title="Privacy and data" description="Choose local privacy preferences and export the demo data stored on this device."><Select label="Profile visibility" value={draft.profileVisibility} onChange={(event) => update("profileVisibility", event.target.value)}><option>Household members only</option><option>Private</option></Select><SettingToggle label="Share anonymous product analytics" detail="Off by default. Production analytics require consent and a configured provider." checked={draft.analytics} onChange={(value) => update("analytics", value)} backend /><SettingToggle label="Retain recognition images for model review" detail="Off by default. Requires explicit consent, secure storage, and a retention policy." checked={draft.recognitionImages} onChange={(value) => update("recognitionImages", value)} backend /><Button variant="secondary" onClick={exportData} icon={<Download size={17} />}>Export local demo data</Button><BackendNotice text="A complete production export must be generated by an authenticated backend and include authorized database and storage records." /></SettingsSection>}
      {section === "Security" && <SettingsSection title="Security" description="Review the current demo session and account-security actions."><div className="security-session"><ShieldCheck /><div><b>Current demo session</b><p>Chrome · Quezon City · Active now</p></div><Badge tone="success">Current</Badge></div><Button variant="secondary" onClick={() => gated(() => { setDialogError(""); setDialog("password"); })}>Change password</Button><Button variant="secondary" onClick={() => gated(() => setDialog("sessions"))}>Sign out other sessions</Button><div className="danger-zone"><h3>Delete account</h3><p>Deletion requires recent authentication and a secure server-side request.</p><Button variant="danger" onClick={() => gated(() => setDialog("delete"))}>Review deletion request</Button></div><BackendNotice text="Session revocation, password changes, and account deletion require Supabase Auth and server-side verification." /></SettingsSection>}
      {section === "Application information" && <SettingsSection title="Application information" description="Product details, help, policies, and recognition limitations."><div className="about-logo"><Logo /><Badge>Version 1.0 prototype</Badge></div><div className="info-topic-tabs">{["About", "Help", "FAQ", "Recognition", "Privacy", "Terms"].map((topic) => <button className={infoTopic === topic ? "active" : ""} onClick={() => setInfoTopic(topic)} key={topic}>{topic}</button>)}</div><InfoTopic topic={infoTopic} /></SettingsSection>}
      {section === "Admin profile" && <SettingsSection title="Administrator profile" description="Administrative identity is separate from household ownership."><div className="profile-photo-row"><span>AD</span><div><b>Protected administrator</b><p>Server-verified role required in production</p></div><Badge tone="warning">Demo role</Badge></div><Input label="Display name *" value={draft.adminName} onChange={(event) => update("adminName", event.target.value)} /><Input label="Administrative email *" type="email" value={draft.adminEmail} onChange={(event) => update("adminEmail", event.target.value)} /><BackendNotice text="The client cannot grant administrator access. Supabase Auth claims and database authorization must verify this role." /></SettingsSection>}
      {section === "Recognition" && <SettingsSection title="Recognition configuration" description="Private recognition credentials must remain on a secure server."><div className="security-session"><ScanLine /><div><b>Demo recognition adapter</b><p>Fixed prototype results · no external model request</p></div><Badge tone="warning">Not connected</Badge></div><SettingToggle label="Require user confirmation" detail="Recognized items must be reviewed before inventory writes." checked={draft.confirmRecognition} onChange={(value) => update("confirmRecognition", value)} /><BackendNotice text="Model endpoints, credentials, rate limits, diagnostics, and job storage require a server-side recognition service." /></SettingsSection>}
      {section === "Reports" && <SettingsSection title="Report preferences" description="Configure privacy-safe defaults for aggregate administrative reports."><Select label="Default report" value={draft.defaultReport} onChange={(event) => update("defaultReport", event.target.value)}><option>Registered users</option><option>Most-stored items</option><option>Expired-item summary</option></Select><Select label="Export format" value={draft.exportFormat} onChange={(event) => update("exportFormat", event.target.value)}><option>CSV</option><option>JSON</option></Select><SettingToggle label="Exclude direct identifiers" detail="Keep exports aggregated and privacy-minimized." checked={draft.excludeIdentifiers} onChange={(value) => update("excludeIdentifiers", value)} /><BackendNotice text="Production reports must be generated from permitted aggregate queries on the server." /></SettingsSection>}
      {section === "Security & audit" && <SettingsSection title="Security and audit" description="Administrative changes require reasons, immutable logs, and verified permissions."><SettingToggle label="Require reasons for status changes" detail="Require a reason before activating or deactivating an account." checked={draft.requireAdminReason} onChange={(value) => update("requireAdminReason", value)} /><Input label="Audit retention days" type="number" min="30" max="2555" value={draft.auditRetention} onChange={(event) => update("auditRetention", event.target.value)} /><BackendNotice text="Audit logs, retention enforcement, and administrator authorization require protected backend services." /></SettingsSection>}
      {section === "System information" && <SettingsSection title="System information" description="No live service status is claimed without an authenticated health response."><div className="service-row"><span className="service-dot warning" /><span><b>Supabase services</b><small>Not connected</small></span></div><div className="service-row"><span className="service-dot warning" /><span><b>Recognition service</b><small>Demo adapter</small></span></div><div className="service-row"><span className="service-dot warning" /><span><b>Backup provider</b><small>Not configured</small></span></div><Button variant="secondary" onClick={() => { setStatusChecked(new Date().toLocaleTimeString()); notify("Local configuration reviewed; no backend health check was performed"); }} icon={<RefreshCw size={17} />}>Review configuration</Button><p className="field-help">Last local review: {statusChecked}</p><BackendNotice text="Live health, maintenance, and backup status require authenticated server responses." /></SettingsSection>}
      {error && <div className="settings-error" role="alert"><AlertTriangle size={17} />{error}</div>}
      <div className="settings-save"><span>{dirty ? "Unsaved changes" : "All local changes saved"}</span><Button variant="secondary" onClick={cancel} disabled={!dirty}>Cancel</Button><Button onClick={save} disabled={!dirty}>Save changes</Button></div>
    </Card></div>
    {dialog === "password" && <Modal title="Change password" onClose={() => setDialog(null)}><form className="form-stack" onSubmit={(event) => { event.preventDefault(); if (passwords.next.length < 8 || !/[A-Z]/.test(passwords.next) || !/\d/.test(passwords.next) || passwords.next !== passwords.confirm) { setDialogError("New password needs 8 characters, an uppercase letter, a number, and matching confirmation."); return; } setDialog(null); setDialogError(""); setPasswords({ current: "", next: "", confirm: "" }); notify("Password was not changed: connect Supabase Auth to complete this secure action."); }}><Input label="Current password" type="password" value={passwords.current} onChange={(event) => setPasswords({ ...passwords, current: event.target.value })} required /><Input label="New password" type="password" value={passwords.next} onChange={(event) => setPasswords({ ...passwords, next: event.target.value })} required /><Input label="Confirm new password" type="password" value={passwords.confirm} onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })} required />{dialogError && <div className="settings-error" role="alert"><AlertTriangle size={17} />{dialogError}</div>}<BackendNotice text="Backend required. This prototype validates the form but does not change authentication credentials." /><div className="modal-actions"><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button type="submit">Validate request</Button></div></form></Modal>}
    {dialog === "sessions" && <Modal title="Sign out other sessions?" onClose={() => setDialog(null)}><p className="modal-subtitle">Your current session will stay active. Other sessions can only be revoked by the authentication provider.</p><BackendNotice text="Backend required. No sessions will be revoked in this prototype." /><div className="modal-actions"><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button onClick={() => { setDialog(null); notify("No sessions were revoked; Supabase Auth is not connected."); }}>Acknowledge</Button></div></Modal>}
    {dialog === "delete" && <Modal title="Request account deletion" onClose={() => setDialog(null)}><div className="warning-box"><AlertTriangle /><p>This would remove personal data and may require household ownership transfer. Type DELETE to review the request.</p></div><Input label="Confirmation" value={deleteText} onChange={(event) => setDeleteText(event.target.value)} placeholder="Type DELETE" /><BackendNotice text="Backend required. This prototype will not submit or perform account deletion." /><div className="modal-actions"><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button variant="danger" disabled={deleteText !== "DELETE"} onClick={() => { setDialog(null); setDeleteText(""); notify("Deletion was not submitted; secure backend workflow is not connected."); }}>Review request</Button></div></Modal>}
  </>;
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="settings-section"><h2>{title}</h2><p>{description}</p><div className="settings-form">{children}</div></div>;
}

function OptionCards({ options, active, onChange }: { options: [string, typeof Sun][]; active: string; onChange: (value: string) => void }) {
  return <div className="option-cards">{options.map(([label, Icon]) => <button className={active === label ? "active" : ""} onClick={() => onChange(label)} key={label}><Icon /><span>{label}</span>{active === label && <CheckCircle2 />}</button>)}</div>;
}

function SettingToggle({ label, detail, checked, onChange, backend = false }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void; backend?: boolean }) {
  return <label className="switch-row"><span><b>{label}{backend && <em>Backend required</em>}</b><small>{detail}</small></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>;
}

function BackendNotice({ text }: { text: string }) {
  return <div className="backend-notice"><ShieldCheck size={17} /><div><b>Backend required</b><p>{text}</p></div></div>;
}

function InfoTopic({ topic }: { topic: string }) {
  const content: Record<string, { title: string; body: string }> = {
    About: { title: "About PantryLens", body: "PantryLens is a computer vision-based pantry management and recipe recommendation prototype for Filipino households." },
    Help: { title: "Help and support", body: "Use Scan Food for demo recognition, My Pantry for inventory, Food Monitoring for alerts, and Recipes to compare available and missing ingredients. Production support contact handling requires a backend ticket service." },
    FAQ: { title: "Frequently asked questions", body: "Recognition results must be reviewed. Expiration dates come from users or packaging. Creating a household never automatically transfers personal inventory." },
    Recognition: { title: "Recognition limitations", body: "Accuracy depends on image quality, lighting, packaging, and supported labels. A photo cannot reliably reveal an actual expiration date." },
    Privacy: { title: "Privacy and data handling", body: "The prototype uses local demo state. Production data requires authenticated access, row-level policies, explicit sharing, secure storage, and documented retention." },
    Terms: { title: "Terms of use", body: "Prototype recipes and recognition results require user review and are not nutritional, medical, or food-safety guarantees. Production legal terms require approved policy content." },
  };
  return <div className="info-topic"><h3>{content[topic].title}</h3><p>{content[topic].body}</p></div>;
}

function AdminPage({ notify }: { notify: (s: string) => void }) {
  const [tab, setTab] = useState("Overview");
  const [confirm, setConfirm] = useState<string | null>(null);
  const tabs = ["Overview", "Users", "Recipes", "Categories", "Maintenance", "Reports", "Activity logs"];
  return <>
    <PageHeader eyebrow="Protected administrator preview" title="PantryLens admin" description="Operational tools use simulated, non-private data until server-enforced authorization is connected." actions={<Badge tone="warning"><AlertTriangle size={14} /> Demo service data</Badge>} />
    <div className="admin-tabs">{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
    {tab === "Overview" && <AdminOverview setTab={setTab} />}
    {tab === "Users" && <AdminUsers onConfirm={setConfirm} notify={notify} />}
    {tab === "Recipes" && <AdminRecipes notify={notify} />}
    {tab === "Categories" && <AdminCategories notify={notify} />}
    {tab === "Maintenance" && <AdminMaintenance notify={notify} />}
    {tab === "Reports" && <AdminReports notify={notify} />}
    {tab === "Activity logs" && <AdminLogs />}
    {confirm && <Modal title="Confirm account status change" onClose={() => setConfirm(null)}><div className="warning-box"><AlertTriangle /><p>Deactivate {confirm}? The user will lose application access, but their password remains private in the authentication provider. This action will be audit logged.</p></div><Input label="Reason *" placeholder="Enter an administrative reason" /><div className="modal-actions"><Button variant="secondary" onClick={() => setConfirm(null)}>Cancel</Button><Button variant="danger" onClick={() => { setConfirm(null); notify("Demo account deactivated and audit entry created"); }}>Deactivate account</Button></div></Modal>}
  </>;
}

function AdminOverview({ setTab }: { setTab: (tab: string) => void }) {
  return <><div className="stats-grid admin-stats">{[["Registered users", "1,248", "+8.2% this month", Users], ["Active accounts", "1,197", "95.9% of total", CheckCircle2], ["Recipe catalog", "86", "78 active", Utensils], ["Recognition jobs", "3,941", "91.4% confirmed", ScanLine]].map(([label, value, meta, Icon]) => <Card className="stat-card" key={label as string}><div className="stat-icon green"><Icon size={21} /></div><span>{label as string}</span><strong>{value as string}</strong><small>{meta as string}</small></Card>)}</div><div className="admin-grid"><Card><div className="card-heading"><div><h2>Most stored food items</h2><p>Aggregated demo counts only.</p></div><button onClick={() => setTab("Reports")}>Open report <ChevronRight /></button></div>{[["Rice", 842], ["Eggs", 731], ["Garlic", 659], ["Chicken", 584], ["Tomatoes", 491]].map(([name, count], i) => <div className="rank-row" key={name as string}><b>{i + 1}</b><span>{name as string}</span><div><i className={`bar bar-${i + 1}`} /></div><strong>{count as number}</strong></div>)}</Card><Card><div className="card-heading"><div><h2>System health</h2><p>Last simulated check 2 min ago.</p></div><Badge tone="warning">Not connected</Badge></div>{[["Frontend application", "Available", "success"], ["PostgreSQL database", "Awaiting Supabase", "warning"], ["Recognition service", "Demo model only", "warning"], ["Background scheduler", "Not configured", "neutral"]].map((service) => <div className="service-row" key={service[0]}><span className={`service-dot ${service[2]}`} /><span><b>{service[0]}</b><small>{service[1]}</small></span></div>)}<Button variant="secondary" onClick={() => setTab("Maintenance")}>View diagnostics</Button></Card></div><Card><div className="card-heading"><div><h2>Recent administrative activity</h2><p>Audit-friendly events, never password data.</p></div><button onClick={() => setTab("Activity logs")}>View all <ChevronRight /></button></div><div className="admin-activity"><span><Pencil /></span><div><b>Recipe “Chicken Adobo” updated</b><small>Admin Demo · Today, 9:12 AM</small></div><Badge>Recipe</Badge></div><div className="admin-activity"><span><ShieldCheck /></span><div><b>User account reactivated</b><small>Admin Demo · Yesterday, 4:22 PM</small></div><Badge tone="warning">User</Badge></div></Card></>;
}

function AdminUsers({ onConfirm, notify }: { onConfirm: (name: string) => void; notify: (text: string) => void }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const users = [["Maria Santos", "maria@example.com", "Owner", "Aug 24, 2026", "Santos Home", "Active"], ["Paolo Reyes", "paolo@example.com", "Member", "Aug 18, 2026", "Reyes Family", "Active"], ["Rosa Lim", "rosa@example.com", "Owner", "Jul 30, 2026", "Solo", "Deactivated"], ["Kai Mendoza", "kai@example.com", "Member", "Jul 22, 2026", "Mendoza Home", "Active"]];
  const filteredUsers = users.filter((user) => `${user[0]} ${user[1]}`.toLowerCase().includes(query.toLowerCase()) && (roleFilter === "All roles" || user[2] === roleFilter) && (statusFilter === "All statuses" || user[5] === statusFilter));
  return <><Card className="admin-toolbar"><Input aria-label="Search users" placeholder="Search by name or email…" value={query} onChange={(event) => setQuery(event.target.value)} icon={<Search />} /><Select aria-label="Filter users by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option>All roles</option><option>Owner</option><option>Member</option></Select><Select aria-label="Filter users by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>Active</option><option>Deactivated</option></Select><Button variant="secondary" onClick={() => notify(`Prepared ${filteredUsers.length} permitted demo user rows for export`)} icon={<Download />}>Export permitted data</Button></Card><Card className="table-card admin-table"><div className="data-table"><div className="table-head"><span>User</span><span>Role</span><span>Joined</span><span>Household</span><span>Status</span><span /></div>{filteredUsers.map((u) => <div className="table-row" key={u[1]}><span className="table-item"><i>{u[0].split(" ").map((n) => n[0]).join("")}</i><span><b>{u[0]}</b><small>{u[1]}</small></span></span><span>{u[2]}</span><span>{u[3]}</span><span>{u[4]}</span><span><Badge tone={u[5] === "Active" ? "success" : "danger"}>{u[5]}</Badge></span><button onClick={() => onConfirm(u[0])} aria-label={`Manage ${u[0]}`}><MoreHorizontal /></button></div>)}</div>{filteredUsers.length === 0 && <div className="empty-state compact"><Search /><h3>No users found</h3><p>Change or clear the current search and filters.</p></div>}</Card><div className="pagination"><span>Showing {filteredUsers.length} of 4 demo users</span><div><Button variant="secondary" disabled>Previous</Button><Button variant="secondary" onClick={() => notify("No additional demo user pages")}>Next</Button></div></div></>;
}

function AdminRecipes({ notify }: { notify: (s: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState("All meal types");
  const [status, setStatus] = useState("All statuses");
  const managedRecipes = recipes.map((recipe, index) => ({ ...recipe, status: index === 3 ? "Draft" : "Active" }));
  const filteredRecipes = managedRecipes.filter((recipe) => recipe.name.toLowerCase().includes(query.toLowerCase()) && (meal === "All meal types" || recipe.meal === meal) && (status === "All statuses" || recipe.status === status));
  return <><div className="admin-page-head"><div><h2>Recipe management</h2><p>Add, edit, review, and deactivate recipe records.</p></div><Button onClick={() => setEdit(true)} icon={<Plus />}>Add recipe</Button></div><Card className="admin-toolbar"><Input aria-label="Search managed recipes" placeholder="Search recipes…" value={query} onChange={(event) => setQuery(event.target.value)} icon={<Search />} /><Select aria-label="Filter managed recipes by meal" value={meal} onChange={(event) => setMeal(event.target.value)}><option>All meal types</option><option>Dinner</option><option>Lunch</option><option>Breakfast</option></Select><Select aria-label="Filter managed recipes by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>Draft</option></Select></Card><div className="admin-recipe-grid">{filteredRecipes.map((recipe) => <Card key={recipe.id}><img src={recipe.image} alt={recipe.name} /><div><Badge tone={recipe.status === "Draft" ? "warning" : "success"}>{recipe.status}</Badge><h3>{recipe.name}</h3><p>{recipe.available.length + recipe.missing.length} required ingredients · {recipe.time}</p><div><Button variant="secondary" onClick={() => setEdit(true)} icon={<Pencil />}>Edit</Button><Button variant="ghost" onClick={() => notify(`${recipe.name} status changed in demo`)}>Deactivate</Button></div></div></Card>)}</div>{filteredRecipes.length === 0 && <Card className="empty-state compact"><Search /><h3>No recipes found</h3><p>Change the search or management filters.</p></Card>}{edit && <Modal title="Edit recipe" onClose={() => setEdit(false)}><form className="form-stack modal-scroll" onSubmit={(e) => { e.preventDefault(); setEdit(false); notify("Recipe changes saved locally"); }}><Input label="Recipe name *" defaultValue="Chicken Adobo" required /><Input label="Description" defaultValue="A comforting Filipino classic simmered in soy, vinegar, and garlic." /><div className="split-fields"><Select label="Meal type"><option>Dinner</option><option>Lunch</option></Select><Select label="Difficulty"><option>Easy</option><option>Medium</option></Select></div><div className="split-fields"><Input label="Preparation time (min)" type="number" defaultValue="15" /><Input label="Cooking time (min)" type="number" defaultValue="30" /></div><Input label="Servings" type="number" defaultValue="4" /><label className="field"><span>Ingredients and quantities</span><textarea rows={4} defaultValue={"Chicken thighs — 1 kg\nSoy sauce — 1/2 cup\nVinegar — 1/3 cup\nGarlic — 6 cloves\nBay leaves — 3"} /></label><label className="field"><span>Cooking instructions</span><textarea rows={5} defaultValue={"1. Marinate chicken.\n2. Brown chicken.\n3. Add sauce and simmer.\n4. Reduce and serve."} /></label><Select label="Status"><option>Active</option><option>Draft</option><option>Deactivated</option></Select><div className="modal-actions"><Button variant="secondary" onClick={() => setEdit(false)}>Cancel</Button><Button type="submit">Save recipe</Button></div></form></Modal>}</>;
}

function AdminCategories({ notify }: { notify: (s: string) => void }) {
  return <><div className="admin-page-head"><div><h2>Food categories</h2><p>Catalog categories are separate from food and inventory records.</p></div><Button onClick={() => notify("New category form opened")} icon={<Plus />}>Add category</Button></div><Card className="category-table">{categories.map((category, i) => <div key={category}><span className={`category-swatch swatch-${(i % 5) + 1}`} /><span><b>{category}</b><small>{Math.max(3, 124 - i * 9)} linked food items</small></span><Badge tone={category === "Other" ? "warning" : "success"}>{category === "Other" ? "Review" : "Active"}</Badge><Button variant="ghost" onClick={() => notify(`${category} editor opened`)}><Pencil /></Button><Button variant="ghost" onClick={() => notify("Category cannot be deleted while linked records exist")}><Archive /></Button></div>)}</Card></>;
}

function AdminMaintenance({ notify }: { notify: (s: string) => void }) {
  return <><Card className="maintenance-warning"><AlertTriangle /><div><b>Backend services are not connected</b><p>Status indicators below are configuration previews, not claims of live service availability or successful backups.</p></div></Card><div className="admin-grid"><Card><h2>Service diagnostics</h2>{[["Supabase Auth", "Not connected"], ["PostgreSQL", "Not connected"], ["Storage", "Not connected"], ["Recognition API", "Demo adapter"], ["Notification scheduler", "Not configured"]].map((s) => <div className="service-row" key={s[0]}><span className="service-dot warning" /><span><b>{s[0]}</b><small>{s[1]}</small></span><Button variant="ghost" onClick={() => notify(`Diagnostics for ${s[0]} opened`)}>Details</Button></div>)}</Card><Card><h2>Backup history</h2><div className="empty-state compact"><Archive /><h3>No verified backups</h3><p>Connect a secure server-side backup provider to create and validate backup records.</p><Button variant="secondary" onClick={() => notify("Backup configuration guide opened")}>Configure backups</Button></div></Card></div><Card><div className="card-heading"><div><h2>Recognition labels</h2><p>Review supported demo labels and confidence behavior.</p></div><Button variant="secondary" onClick={() => notify("Diagnostic test queued in demo")}>Run diagnostic</Button></div><div className="label-cloud">{["Eggplant", "Tomato", "Chicken", "Rice", "Eggs", "Garlic", "Pechay", "Coconut milk", "Bangus", "Onion"].map((l) => <Badge key={l}>{l}</Badge>)}</div></Card></>;
}

function AdminReports({ notify }: { notify: (s: string) => void }) {
  const [from, setFrom] = useState("2026-08-01");
  const [to, setTo] = useState("2026-09-08");
  const [report, setReport] = useState("Registered users");
  const downloadCsv = () => {
    if (from > to) { notify("Choose an end date on or after the start date"); return; }
    const rows: Record<string, string> = {
      "Registered users": "metric,value\nRegistered users,1248\nActive accounts,1197\nDeactivated accounts,51",
      "Most-stored items": "item,records\nRice,842\nEggs,731\nGarlic,659",
      "Expired-item summary": "category,records\nVegetables,72\nDairy,41\nMeat,33\nOther,36",
    };
    const csv = `from,${from}\nto,${to}\nreport,${report}\n${rows[report]}`;
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "pantrylens-demo-report.csv"; link.click(); URL.revokeObjectURL(link.href); notify("Demo CSV exported");
  };
  return <><Card className="report-toolbar"><Input label="From" type="date" value={from} onChange={(event) => setFrom(event.target.value)} /><Input label="To" type="date" value={to} onChange={(event) => setTo(event.target.value)} /><Select label="Report type" value={report} onChange={(event) => setReport(event.target.value)}><option>Registered users</option><option>Most-stored items</option><option>Expired-item summary</option></Select><Button onClick={downloadCsv} icon={<Download />}>Export CSV</Button></Card><div className="report-grid"><Card><span className="report-icon"><Users /></span><b>1,248</b><h3>Registered users</h3><p>+94 during selected period</p></Card><Card><span className="report-icon"><Package /></span><b>842</b><h3>Rice inventory records</h3><p>Most stored catalog item</p></Card><Card><span className="report-icon danger"><AlertTriangle /></span><b>182</b><h3>Expired-item records</h3><p>14.6% reviewed as consumed</p></Card></div><Card><div className="card-heading"><div><h2>{report}</h2><p>Demo summary for {from} through {to}; no private household details.</p></div></div>{report === "Expired-item summary" ? <div className="simple-chart"><div><span>Vegetables</span><i className="chart-veg" /><b>72</b></div><div><span>Dairy</span><i className="chart-dairy" /><b>41</b></div><div><span>Meat</span><i className="chart-meat" /><b>33</b></div><div><span>Other</span><i className="chart-other" /><b>36</b></div></div> : <div className="empty-state compact"><FileText /><h3>{report} selected</h3><p>Use Export CSV to download the selected aggregate demo dataset.</p></div>}</Card></>;
}

function AdminLogs() {
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [action, setAction] = useState("All actions");
  const [date, setDate] = useState("");
  const logs = [
    { time: "Today, 9:12 AM", date: "2026-09-08", actor: "admin@pantrylens.app", title: "Updated recipe", target: "Chicken Adobo", code: "recipe.update", type: "Recipe update" },
    { time: "Yesterday, 4:22 PM", date: "2026-09-07", actor: "admin@pantrylens.app", title: "Reactivated user", target: "user_02841", code: "user.status", type: "User status" },
    { time: "Sep 6, 11:05 AM", date: "2026-09-06", actor: "system", title: "Recognition job failed", target: "job_009842", code: "recognition.error", type: "System setting" },
    { time: "Sep 5, 2:44 PM", date: "2026-09-05", actor: "admin@pantrylens.app", title: "Added category", target: "Frozen Food", code: "category.create", type: "System setting" },
    { time: "Sep 4, 8:00 AM", date: "2026-09-04", actor: "system", title: "Backup skipped", target: "Provider not configured", code: "backup.skip", type: "System setting" },
  ];
  const filteredLogs = logs.filter((log) => `${log.title} ${log.target} ${log.actor}`.toLowerCase().includes(query.toLowerCase()) && (action === "All actions" || log.type === action) && (!date || log.date === date));
  return <><Card className="admin-toolbar"><Input aria-label="Search activity logs" placeholder="Search activity logs…" value={query} onChange={(event) => setQuery(event.target.value)} icon={<Search />} /><Select aria-label="Filter logs by action" value={action} onChange={(event) => setAction(event.target.value)}><option>All actions</option><option>User status</option><option>Recipe update</option><option>System setting</option></Select><Input aria-label="Filter logs by date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Card><Card className="log-list">{filteredLogs.map((log) => <div key={log.time + log.title}><span><Clock3 /></span><div><b>{log.title}</b><p>{log.target}</p><small>{log.time} · {log.actor}</small></div><code>{log.code}</code><button aria-label={`View ${log.title} log details`} onClick={() => setSelected(`${log.title} · ${log.target} · ${log.time} · ${log.actor}`)}><ChevronRight /></button></div>)}{filteredLogs.length === 0 && <div className="empty-state compact"><Search /><h3>No activity logs found</h3><p>Change the search, action, or date filter.</p></div>}</Card>{selected && <Modal title="Audit log detail" onClose={() => setSelected(null)}><p className="modal-subtitle">{selected}</p><div className="auth-note"><ShieldCheck size={16} />Audit records exclude passwords and private authentication credentials.</div><div className="modal-actions"><Button onClick={() => setSelected(null)}>Close</Button></div></Modal>}</>;
}

function ArrowRightIcon() { return <ChevronRight size={18} />; }

export default function App() {
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState<Role>("guest");
  const [auth, setAuth] = useState<"login" | "signup" | null>(null);
  const [currentUser, setCurrentUser] = useState<{
  id: string;
  email?: string;
  user_metadata?: { full_name?: string };
} | null>(null);

useEffect(() => {
  let active = true;

  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Unable to load Supabase session:", error.message);
      return;
    }

    if (active) {
      setCurrentUser(data.session?.user ?? null);
    }
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setCurrentUser(session?.user ?? null);
  });

  return () => {
    active = false;
    subscription.unsubscribe();
  };
}, []);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(`pantrylens-settings-${role}`);
      if (!stored) return;
      const preferences = JSON.parse(stored) as SettingsData;
      const root = document.documentElement;
      const theme = preferences.theme === "System" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light" : preferences.theme;
      root.dataset.theme = theme.toLowerCase();
      root.dataset.density = preferences.density.toLowerCase();
      root.dataset.contrast = preferences.contrast ? "high" : "normal";
      root.dataset.largeText = preferences.largeText ? "true" : "false";
      root.dataset.reduceMotion = preferences.reduceMotion ? "true" : "false";
    } catch {
      // Ignore malformed local prototype preferences and retain the default theme.
    }
  }, [role]);
  const enterGuest = () => { setRole("guest"); setEntered(true); };
  const authSuccess = () => { setAuth(null); setRole("owner"); setEntered(true); };
  if (!entered) return <><Landing onEnter={enterGuest} onAuth={setAuth} />{auth && <AuthModal mode={auth} onClose={() => setAuth(null)} onSuccess={authSuccess} />}</>;
  return (
  <AppShell
    role={role}
    user={currentUser}
    onRoleChange={(next) => setRole(next)}
    onExit={() => setEntered(false)}
  />
);}
