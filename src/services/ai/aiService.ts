import { WorkflowDefinition } from '@/types/workflow';
import { planAutomation, type AutomationPlan } from "@/services/agents/automationAgent";

/**
 * Generates a structured workflow from a natural language prompt.
 * Currently uses pattern matching; will connect to AI API later.
 */
export const generateWorkflowFromPrompt = async (prompt: string): Promise<WorkflowDefinition> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lower = prompt.toLowerCase();

  if (lower.includes('gmail') && lower.includes('slack')) {
    return {
      name: "Email to Slack Summary",
      description: "Summarize incoming emails and send to Slack",
      steps: [
        { id: '1', type: 'trigger', provider: 'gmail', action: 'new_email', label: 'New Email', description: 'Triggered on new Gmail email', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'summarize', label: 'AI Summarize', description: 'Summarize email content', config: { prompt: "Summarize this email concisely" } },
        { id: '3', type: 'action', provider: 'slack', action: 'send_message', label: 'Send to Slack', description: 'Post summary to #general', config: { channel: '#general' } },
      ],
    };
  }

  if (lower.includes('form') && lower.includes('sheet')) {
    return {
      name: "Form to Sheets",
      description: "Capture form submissions to Google Sheets",
      steps: [
        { id: '1', type: 'trigger', provider: 'webhook', action: 'form_submit', label: 'Form Submit', description: 'Triggered on form submission', config: {} },
        { id: '2', type: 'action', provider: 'google_sheets', action: 'add_row', label: 'Add to Sheet', description: 'Add row to Google Sheets', config: { spreadsheet: 'Leads' } },
        { id: '3', type: 'action', provider: 'slack', action: 'send_message', label: 'Notify Team', description: 'Send notification', config: { channel: '#leads' } },
      ],
    };
  }

  if (lower.includes('meeting') || lower.includes('notes')) {
    return {
      name: "Meeting Notes Processor",
      description: "Process and distribute meeting notes",
      steps: [
        { id: '1', type: 'trigger', provider: 'calendar', action: 'meeting_end', label: 'Meeting Ends', description: 'Triggered when meeting ends', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'extract_action_items', label: 'Extract Actions', description: 'Extract action items from notes', config: {} },
        { id: '3', type: 'action', provider: 'notion', action: 'create_page', label: 'Save to Notion', description: 'Create Notion page with notes', config: {} },
      ],
    };
  }

  // Default: generic workflow
  return {
    name: "Custom Automation",
    description: prompt,
    steps: [
      { id: '1', type: 'trigger', provider: 'webhook', action: 'incoming', label: 'Webhook Trigger', description: 'Receives incoming data', config: {} },
      { id: '2', type: 'ai', provider: 'openai', action: 'process', label: 'AI Process', description: 'Process data with AI', config: {} },
      { id: '3', type: 'action', provider: 'webhook', action: 'outgoing', label: 'Send Result', description: 'Send processed result', config: {} },
    ],
  };
};

/**
 * AI Automation Agent (planning layer).
 *
 * This does NOT generate executable workflow JSON; it produces a structured plan
 * that can be shown to the user and used to guide workflow generation.
 */
export const planAutomationFromPrompt = async (prompt: string): Promise<AutomationPlan> => {
  return await planAutomation(prompt);
};
