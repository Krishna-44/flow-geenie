import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SettingsPage: NextPageWithLayout = () => {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="surface-card p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Profile</h3>
          <p className="text-xs text-muted-foreground mb-4">Update your personal information</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
              <input
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground"
                defaultValue="user@example.com"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Name</label>
              <input
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground"
                defaultValue="Alex Johnson"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Integrations</h3>
          <p className="text-xs text-muted-foreground mb-4">Connected services for your workflows</p>
          <div className="space-y-2">
            {["Gmail", "Slack", "Google Sheets", "Notion"].map((service) => (
              <div key={service} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{service}</span>
                <Button variant="outline" size="sm" className="btn-press text-xs">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Danger Zone</h3>
          <p className="text-xs text-muted-foreground mb-4">Irreversible account actions</p>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 btn-press">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

SettingsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default SettingsPage;

