'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@repo/ui/components/button'
import {
  Activity,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Globe,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Continuous uptime monitoring across multiple regions with instant alerts',
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Detailed response time metrics and performance trends over time',
    },
    {
      icon: Shield,
      title: 'Reliability Insights',
      description: 'Comprehensive incident tracking and historical data analysis',
    },
    {
      icon: Clock,
      title: 'Instant Notifications',
      description: 'Get alerted immediately when issues occur with detailed incident reports',
    },
    {
      icon: Zap,
      title: 'Fast Response',
      description: 'Sub-second response time detection and reporting',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Monitor from multiple geographic regions simultaneously',
    },
  ]

  const stats = [
    { value: '99.99%', label: 'Average Uptime' },
    { value: '< 100ms', label: 'Response Time' },
    { value: '5000+', label: 'Sites Monitored' },
    { value: '24/7', label: 'Support' },
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      description: 'For small teams',
      features: [
        'Up to 10 websites',
        '5-minute check intervals',
        'Email alerts',
        'Basic analytics',
        '30-day history',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$79',
      description: 'For growing teams',
      features: [
        'Unlimited websites',
        '1-minute check intervals',
        'SMS & Email alerts',
        'Advanced analytics',
        '90-day history',
        'Regional monitoring',
        'Slack integration',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Professional',
        'Custom intervals',
        'Webhook support',
        'Priority support',
        'Custom retention',
        'SSO & team management',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'DevOps Lead',
      company: 'TechCorp',
      message: 'Website Monitor has been invaluable for our team. The real-time alerts have saved us from major incidents.',
      avatar: 'SC',
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO',
      company: 'StartupXYZ',
      message: 'The analytics dashboard gives us exactly the insights we need to optimize our infrastructure.',
      avatar: 'MJ',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Site Reliability Engineer',
      company: 'CloudServices Inc',
      message: 'Simple, elegant, and powerful. This is how monitoring should be done.',
      avatar: 'ER',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Website Monitor</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden items-center gap-8 md:flex">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
                Testimonials
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-4 space-y-3 border-t border-border pt-4 md:hidden">
              <Link href="#features" className="block text-sm hover:text-primary transition">
                Features
              </Link>
              <Link href="#pricing" className="block text-sm hover:text-primary transition">
                Pricing
              </Link>
              <Link href="#testimonials" className="block text-sm hover:text-primary transition">
                Testimonials
              </Link>
              <div className="flex gap-2 pt-2">
                <Link href="/" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-40"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary animate-fade-in"
              style={{
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              <Zap className="h-4 w-4" />
              <span>Real-time website monitoring at your fingertips</span>
            </div>

            {/* Heading */}
            <div
              className="space-y-4"
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.1s both',
              }}
            >
              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Know When Your Site{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Goes Down
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                Monitor your website uptime with precision. Get instant alerts when issues occur and comprehensive analytics to optimize performance.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col gap-4 sm:flex-row items-center justify-center"
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.2s both',
              }}
            >
              <Link href="/signin">
                <Button size="lg" className="gap-2 px-8">
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/Tejas-pr/stackwatch">
                <Button size="lg" variant="outline" className="gap-2 px-8 bg-transparent">
                  Watch Demo <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-8"
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.3s both',
              }}
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-secondary/30 p-4 backdrop-blur-sm hover:bg-secondary/50 transition"
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Powerful Monitoring Features
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Everything you need to maintain peak website performance and reliability.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-card p-8 hover:border-primary/50 hover:bg-secondary/20 transition duration-300 hover:shadow-lg"
                    style={{
                      animation: `fadeInUp 0.8s ease-out ${0.1 * idx}s both`,
                    }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-muted-foreground">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Choose the perfect plan for your monitoring needs. No hidden fees.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-xl border transition duration-300 ${
                    plan.highlighted
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10 shadow-lg lg:scale-105'
                      : 'border-border bg-card hover:border-primary/50'
                  } p-8`}
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${0.1 * idx}s both`,
                  }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="text-4xl font-bold">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>

                  <Button
                    className="mt-6 w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>

                  <div className="mt-8 space-y-3 border-t border-border pt-8">
                    {plan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Trusted by Teams Worldwide
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                See what our customers have to say about Website Monitor.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition duration-300"
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${0.1 * idx}s both`,
                  }}
                >
                  <p className="text-muted-foreground italic">"{testimonial.message}"</p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-semibold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to Monitor Your Websites?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of teams using Website Monitor to ensure their critical services stay online.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">Website Monitor</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Real-time website monitoring made simple and powerful.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Website Monitor. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
