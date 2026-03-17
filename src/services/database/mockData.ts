import { Workflow, WorkflowRun, Template } from '@/types/workflow';

// Mock data store
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Email Summarizer',
    description: 'Summarize incoming Gmail emails and send to Slack',
    workflow_json: {
      name: 'Email Summarizer',
      steps: [
        { id: '1', type: 'trigger', provider: 'gmail', action: 'new_email', label: 'New Email', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'summarize', label: 'AI Summarize', config: {} },
        { id: '3', type: 'action', provider: 'slack', action: 'send_message', label: 'Send to Slack', config: {} },
      ],
    },
    status: 'active',
    created_at: '2026-03-15T10:00:00Z',
    updated_at: '2026-03-15T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Lead Capture',
    description: 'Capture form submissions to Google Sheets and notify on Slack',
    workflow_json: {
      name: 'Lead Capture',
      steps: [
        { id: '1', type: 'trigger', provider: 'webhook', action: 'form_submit', label: 'Form Submit', config: {} },
        { id: '2', type: 'action', provider: 'google_sheets', action: 'add_row', label: 'Add to Sheet', config: {} },
        { id: '3', type: 'action', provider: 'slack', action: 'send_message', label: 'Notify', config: {} },
      ],
    },
    status: 'active',
    created_at: '2026-03-14T08:00:00Z',
    updated_at: '2026-03-14T08:00:00Z',
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'Meeting Notes',
    description: 'Process meeting notes and save to Notion',
    workflow_json: {
      name: 'Meeting Notes',
      steps: [
        { id: '1', type: 'trigger', provider: 'calendar', action: 'meeting_end', label: 'Meeting Ends', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'extract', label: 'Extract Actions', config: {} },
        { id: '3', type: 'action', provider: 'notion', action: 'create_page', label: 'Save to Notion', config: {} },
      ],
    },
    status: 'inactive',
    created_at: '2026-03-13T14:00:00Z',
    updated_at: '2026-03-13T14:00:00Z',
  },
];

const mockRuns: WorkflowRun[] = [
  { id: 'r1', workflow_id: '1', status: 'success', logs: {}, started_at: '2026-03-17T09:00:00Z', finished_at: '2026-03-17T09:00:02Z' },
  { id: 'r2', workflow_id: '1', status: 'success', logs: {}, started_at: '2026-03-17T08:30:00Z', finished_at: '2026-03-17T08:30:01Z' },
  { id: 'r3', workflow_id: '2', status: 'failed', logs: { error: 'Connection timeout' }, started_at: '2026-03-17T07:00:00Z', finished_at: '2026-03-17T07:00:05Z' },
  { id: 'r4', workflow_id: '1', status: 'success', logs: {}, started_at: '2026-03-16T15:00:00Z', finished_at: '2026-03-16T15:00:03Z' },
  { id: 'r5', workflow_id: '3', status: 'success', logs: {}, started_at: '2026-03-16T12:00:00Z', finished_at: '2026-03-16T12:00:02Z' },
];

/* ────────────────────────────────────────────
   Template categories used for filtering
   ──────────────────────────────────────────── */
export type TemplateCategory = 'Email' | 'Social Media' | 'Productivity' | 'Business';

export const TEMPLATE_CATEGORIES: TemplateCategory[] = ['Email', 'Social Media', 'Productivity', 'Business'];

export const mockTemplates: Template[] = [
  // ── EMAIL AUTOMATION ──────────────────────────
  {
    id: 't1',
    name: 'Smart Email Spam Filter',
    category: 'Email',
    description: 'Automatically detect spam, promotional emails, newsletters, and low-priority emails using AI and either delete them or move them to a spam folder.',
    useCase: 'Keep your inbox clean by auto-deleting spam and archiving promotional emails so you only see what matters.',
    template_json: {
      name: 'Smart Email Spam Filter',
      steps: [
        { id: '1', type: 'trigger', provider: 'gmail', action: 'new_email', label: 'New Email Received', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'classify_email', label: 'AI Classify Email', config: { categories: ['spam', 'promotional', 'important'] } },
        { id: '3', type: 'action', provider: 'gmail', action: 'move_or_delete', label: 'Delete / Move to Spam', config: {} },
      ],
    },
  },
  {
    id: 't2',
    name: 'Important Email Summarizer',
    category: 'Email',
    description: 'Summarize important emails and send the summary to a messaging platform like Slack or Notion.',
    useCase: 'Stay on top of critical communications without reading every email — get AI-powered summaries delivered to Slack.',
    template_json: {
      name: 'Important Email Summarizer',
      steps: [
        { id: '1', type: 'trigger', provider: 'gmail', action: 'new_email', label: 'New Email', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'summarize', label: 'AI Summarize', config: {} },
        { id: '3', type: 'action', provider: 'slack', action: 'send_message', label: 'Send Summary to Slack', config: {} },
      ],
    },
  },
  {
    id: 't3',
    name: 'Daily Inbox Digest',
    category: 'Email',
    description: 'Every morning send a summary of all important emails received in the last 24 hours.',
    useCase: 'Start your day with a single digest of yesterday\'s key emails instead of scrolling through your entire inbox.',
    template_json: {
      name: 'Daily Inbox Digest',
      steps: [
        { id: '1', type: 'trigger', provider: 'schedule', action: 'daily_morning', label: 'Morning Schedule', config: { time: '08:00' } },
        { id: '2', type: 'action', provider: 'gmail', action: 'collect_emails', label: 'Collect Last 24h Emails', config: {} },
        { id: '3', type: 'ai', provider: 'openai', action: 'summarize_batch', label: 'AI Summarize All', config: {} },
        { id: '4', type: 'action', provider: 'slack', action: 'send_message', label: 'Send Digest', config: {} },
      ],
    },
  },

  // ── SOCIAL MEDIA (LinkedIn + General) ─────────
  {
    id: 't4',
    name: 'LinkedIn Post Generator From Photos',
    category: 'Social Media',
    description: 'Upload photos and automatically generate a professional LinkedIn post with AI-written captions and hashtags.',
    useCase: 'Post event photos or workshop highlights to LinkedIn instantly with professional captions and relevant hashtags.',
    template_json: {
      name: 'LinkedIn Photo Post Generator',
      steps: [
        { id: '1', type: 'trigger', provider: 'upload', action: 'image_upload', label: 'Upload Image', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'generate_caption', label: 'AI Generate Caption', config: { tone: 'professional', hashtags: true } },
        { id: '3', type: 'action', provider: 'linkedin', action: 'create_post', label: 'Post to LinkedIn', config: {} },
      ],
    },
  },
  {
    id: 't5',
    name: 'LinkedIn Job Finder',
    category: 'Social Media',
    description: 'Automatically search LinkedIn for jobs based on your preferences and receive a curated list daily.',
    useCase: 'Never miss a relevant job opportunity — get a daily AI-filtered list matching your title, location, and experience level.',
    template_json: {
      name: 'LinkedIn Job Finder',
      steps: [
        { id: '1', type: 'trigger', provider: 'schedule', action: 'daily', label: 'Daily Trigger', config: { time: '09:00' } },
        { id: '2', type: 'action', provider: 'linkedin', action: 'search_jobs', label: 'Search LinkedIn Jobs', config: { title: '', location: '', experience: '' } },
        { id: '3', type: 'ai', provider: 'openai', action: 'filter_jobs', label: 'AI Filter & Rank', config: {} },
        { id: '4', type: 'action', provider: 'email', action: 'send_email', label: 'Send Job List', config: {} },
      ],
    },
  },
  {
    id: 't6',
    name: 'Auto Job Application Assistant',
    category: 'Social Media',
    description: 'Automatically apply to relevant jobs using your saved resume and profile details with AI match scoring.',
    useCase: 'Save hours on job applications — let AI score job matches and auto-fill applications with your resume.',
    template_json: {
      name: 'Auto Job Application',
      steps: [
        { id: '1', type: 'trigger', provider: 'linkedin', action: 'new_job_match', label: 'New Job Match', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'match_score', label: 'AI Match Scoring', config: {} },
        { id: '3', type: 'action', provider: 'linkedin', action: 'submit_application', label: 'Submit Application', config: { resume: '', coverLetter: '' } },
      ],
    },
  },
  {
    id: 't7',
    name: 'Social Media Auto Poster',
    category: 'Social Media',
    description: 'Post the same content automatically across multiple social media platforms with scheduling.',
    useCase: 'Maintain a consistent social presence by publishing once and distributing to LinkedIn, Twitter, and Instagram.',
    template_json: {
      name: 'Social Media Auto Poster',
      steps: [
        { id: '1', type: 'trigger', provider: 'webhook', action: 'new_content', label: 'Content Input', config: {} },
        { id: '2', type: 'action', provider: 'scheduler', action: 'schedule_post', label: 'Schedule Posts', config: {} },
        { id: '3', type: 'action', provider: 'multi_social', action: 'post_all', label: 'Post to All Platforms', config: { platforms: ['linkedin', 'twitter', 'instagram'] } },
      ],
    },
  },
  {
    id: 't8',
    name: 'Blog to Social Media',
    category: 'Social Media',
    description: 'Convert new blog posts into social media posts with AI-rewritten captions for each platform.',
    useCase: 'Automatically promote every blog article on LinkedIn and Twitter with platform-optimized copy.',
    template_json: {
      name: 'Blog to Social Media',
      steps: [
        { id: '1', type: 'trigger', provider: 'rss', action: 'new_item', label: 'New Blog Post', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'rewrite_content', label: 'AI Rewrite for Social', config: {} },
        { id: '3', type: 'action', provider: 'linkedin', action: 'create_post', label: 'Post to LinkedIn', config: {} },
        { id: '4', type: 'action', provider: 'twitter', action: 'post', label: 'Post to Twitter', config: {} },
      ],
    },
  },
  {
    id: 't9',
    name: 'Event Photo Auto Poster',
    category: 'Social Media',
    description: 'Automatically generate captions and publish photos after events to social media.',
    useCase: 'Share event highlights instantly with professional AI-generated captions.',
    template_json: {
      name: 'Event Photo Auto Poster',
      steps: [
        { id: '1', type: 'trigger', provider: 'upload', action: 'photo_upload', label: 'Upload Event Photo', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'generate_caption', label: 'AI Generate Caption', config: {} },
        { id: '3', type: 'action', provider: 'linkedin', action: 'create_post', label: 'Post to LinkedIn', config: {} },
      ],
    },
  },

  // ── PRODUCTIVITY ──────────────────────────────
  {
    id: 't10',
    name: 'Meeting Notes Processor',
    category: 'Productivity',
    description: 'Convert meeting transcripts into structured notes with action items and save them to Notion.',
    useCase: 'Never lose meeting action items again — AI extracts tasks and key decisions from transcripts automatically.',
    template_json: {
      name: 'Meeting Notes Processor',
      steps: [
        { id: '1', type: 'trigger', provider: 'upload', action: 'transcript_upload', label: 'Upload Transcript', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'extract_actions', label: 'AI Extract Notes & Tasks', config: {} },
        { id: '3', type: 'action', provider: 'notion', action: 'create_page', label: 'Save to Notion', config: {} },
      ],
    },
  },
  {
    id: 't11',
    name: 'Daily Task Generator',
    category: 'Productivity',
    description: 'Generate a prioritized daily task list from your calendar events using AI.',
    useCase: 'Start each day with a clear, AI-prioritized to-do list based on your upcoming meetings and deadlines.',
    template_json: {
      name: 'Daily Task Generator',
      steps: [
        { id: '1', type: 'trigger', provider: 'calendar', action: 'daily_events', label: 'Calendar Events', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'generate_tasks', label: 'AI Generate Task List', config: {} },
        { id: '3', type: 'action', provider: 'notion', action: 'create_page', label: 'Save Tasks to Notion', config: {} },
      ],
    },
  },
  {
    id: 't12',
    name: 'File Organization Automation',
    category: 'Productivity',
    description: 'Automatically organize files uploaded to Google Drive by categorizing them with AI.',
    useCase: 'Keep Google Drive tidy — AI categorizes new files and moves them to the right folder automatically.',
    template_json: {
      name: 'File Organization',
      steps: [
        { id: '1', type: 'trigger', provider: 'google_drive', action: 'file_upload', label: 'New File Upload', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'categorize_file', label: 'AI Categorize', config: {} },
        { id: '3', type: 'action', provider: 'google_drive', action: 'move_file', label: 'Move to Folder', config: {} },
      ],
    },
  },

  // ── BUSINESS ──────────────────────────────────
  {
    id: 't13',
    name: 'Lead Capture Automation',
    category: 'Business',
    description: 'Capture leads from website forms, store them in Google Sheets, and notify your sales team on Slack.',
    useCase: 'Never miss a lead — automatically log form submissions and alert sales reps in real-time.',
    template_json: {
      name: 'Lead Capture',
      steps: [
        { id: '1', type: 'trigger', provider: 'webhook', action: 'form_submit', label: 'Form Submission', config: {} },
        { id: '2', type: 'action', provider: 'google_sheets', action: 'add_row', label: 'Save to Google Sheets', config: {} },
        { id: '3', type: 'action', provider: 'slack', action: 'send_message', label: 'Notify Sales Team', config: {} },
      ],
    },
  },
  {
    id: 't14',
    name: 'Customer Inquiry Auto Response',
    category: 'Business',
    description: 'Automatically generate and send replies to common customer email inquiries using AI.',
    useCase: 'Reduce response times by auto-replying to common questions with AI-crafted, personalized responses.',
    template_json: {
      name: 'Customer Auto Response',
      steps: [
        { id: '1', type: 'trigger', provider: 'gmail', action: 'new_email', label: 'Customer Email', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'generate_response', label: 'AI Generate Reply', config: {} },
        { id: '3', type: 'action', provider: 'gmail', action: 'send_email', label: 'Send Reply', config: {} },
      ],
    },
  },
  {
    id: 't15',
    name: 'Customer Feedback Analyzer',
    category: 'Business',
    description: 'Analyze customer feedback for sentiment and categorize it, then generate actionable reports.',
    useCase: 'Understand customer sentiment at scale — AI categorizes feedback and routes insights to the right team.',
    template_json: {
      name: 'Feedback Analyzer',
      steps: [
        { id: '1', type: 'trigger', provider: 'webhook', action: 'new_feedback', label: 'New Feedback', config: {} },
        { id: '2', type: 'ai', provider: 'openai', action: 'analyze_sentiment', label: 'AI Sentiment Analysis', config: {} },
        { id: '3', type: 'action', provider: 'slack', action: 'route_message', label: 'Route to Team', config: {} },
      ],
    },
  },
];

export const getWorkflows = (): Workflow[] => mockWorkflows;
export const getWorkflowById = (id: string): Workflow | undefined => mockWorkflows.find(w => w.id === id);
export const getWorkflowRuns = (): WorkflowRun[] => mockRuns;
export const getRunsByWorkflowId = (id: string): WorkflowRun[] => mockRuns.filter(r => r.workflow_id === id);
export const getTemplates = (): Template[] => mockTemplates;
export const getStats = () => ({
  total: mockWorkflows.length,
  active: mockWorkflows.filter(w => w.status === 'active').length,
  runs: mockRuns.length,
});
