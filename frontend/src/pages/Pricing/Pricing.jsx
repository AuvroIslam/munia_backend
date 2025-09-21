import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, XCircle, BookOpen, Brain } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../../api/apiClient";

export default function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"
  const YEARLY_DISCOUNT = 0.2; // 20% off
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null); // New state for payment status

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Assuming a session ID in the URL means a successful payment redirect.
      // This is less secure than a backend check but fulfills the requirement.
      setPaymentStatus('success');
      
      // Optional: Clear the session_id from the URL to make it cleaner
      navigate('/pricing', { replace: true });
    }
  }, [searchParams, navigate]);

  const plans = useMemo(() => {
    const base = [
      {
        id: "free",
        title: "Free",
        badge: null,
        subtitle: "Perfect for casual readers",
        icon: BookOpen,
        priceMonthly: 0,
        cta: "Get Started",
        planId: "free",
        positive: [
          "Access to free books only",
          "3 AI summaries per month",
          "Basic mood recommendations",
          "1 PDF upload per month",
          "100MB storage",
        ],
        negative: ["Ad-free experience"],
        highlight: false,
      },
      {
        id: "premium",
        title: "Premium",
        badge: "Most Popular",
        subtitle: "For serious readers and learners",
        icon: Brain,
        priceMonthly: 9.99,
        cta: "Start Premium",
        planId: billing === "monthly" ? "premium_monthly" : "premium_yearly",
        positive: [
          "Access to entire book library",
          "Unlimited AI summaries",
          "Advanced mood analysis & recommendations",
          "Unlimited PDF uploads",
          "10GB storage",
          "Ad-free experience",
        ],
        negative: [],
        highlight: true,
      },
    ];

    return base.map((p) => {
      const monthly = p.priceMonthly;
      const yearly = +(monthly * 12 * (1 - YEARLY_DISCOUNT)).toFixed(2);
      const price = billing === "monthly" ? monthly : yearly;
      const period = billing === "monthly" ? "/month" : "/year";
      return { ...p, displayPrice: price, period };
    });
  }, [billing]);

  async function handleCheckout(planId) {
    if (planId === "free") {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("User is not authenticated. Redirecting to login.");
      navigate("/auth");
      return;
    }

    try {
      const res = await apiClient.post("/checkout", {
        plan_id: planId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;
      console.log("Checkout session created:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      if (error.response && error.response.status === 403) {
        alert("You are already a premium subscriber.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] w-full bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text">
            Choose Your Reading Journey
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Unlock the full potential of AI-powered reading with our flexible
            pricing plans.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span
            className={`text-sm ${
              billing === "monthly"
                ? "font-semibold"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Monthly
          </span>

          <button
            onClick={() =>
              setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))
            }
            className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition"
            aria-label="Toggle billing period"
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-100 shadow transition ${
                billing === "yearly" ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>

          <span
            className={`text-sm ${
              billing === "yearly"
                ? "font-semibold"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Yearly
          </span>

          <span className="ml-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2.5 py-0.5 text-xs font-semibold">
            Save 20%
          </span>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              onCheckout={handleCheckout}
              paymentStatus={paymentStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, onCheckout, paymentStatus }) {
  const {
    title,
    subtitle,
    icon: Icon,
    badge,
    displayPrice,
    period,
    cta,
    positive,
    negative,
    highlight,
    planId,
  } = plan;

  const isPremiumPlan = planId.includes("premium");
  const buttonText = isPremiumPlan && paymentStatus === 'success' ? "Payment Done" : cta;
  const isButtonDisabled = isPremiumPlan && paymentStatus === 'success';

  return (
    <div
      className={`relative rounded-2xl bg-white dark:bg-gray-900 shadow-sm border
        ${
          highlight
            ? "border-fuchsia-500/50 ring-2 ring-fuchsia-500/30"
            : "border-gray-200 dark:border-gray-800"
        }`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold
            ${
              badge === "Most Popular"
                ? "bg-fuchsia-600 text-white"
                : "bg-purple-600 text-white"
            }`}
        >
          {badge}
        </div>
      )}

      <div className="p-6">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <Icon
            className={`h-8 w-8 ${
              highlight ? "text-fuchsia-600" : "text-purple-600"
            } dark:text-purple-400`}
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            ${displayPrice.toFixed(2)}
          </span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">{period}</span>
        </div>

        {/* Feature list */}
        <ul className="space-y-2.5 mb-6">
          {positive.map((f, i) => (
            <li key={`pos-${i}`} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{f}</span>
            </li>
          ))}
          {negative.map((f, i) => (
            <li key={`neg-${i}`} className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => {
            if (!isButtonDisabled) {
              onCheckout(planId);
            }
          }}
          className={`w-full rounded-xl px-4 py-2.5 font-semibold transition
            ${
              isButtonDisabled
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : highlight
                ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:opacity-90"
                : "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90"
            }`}
          disabled={isButtonDisabled}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}