import { gql } from "graphql-request";
import { gqlClient } from "./graphql-client";
import type {
  FormTemplate,
  MyApplication,
  RecruitmentPeriod,
  ApplicationSubmission,
  ApplicationListItem,
} from "@/types/application";
import type { PagedResponse } from "@/types/common";

const MY_APPLICATION_QUERY = gql`
  query MyApplication {
    myApplication {
      id status formTemplateId track submittedAt
      answers { questionId value }
      paymentInfo { bank account amount holder }
    }
  }
`;

const FORM_TEMPLATE_QUERY = gql`
  query FormTemplate($type: String!) {
    formTemplate(type: $type) {
      id type updatedAt
      questions { id type label required options order }
    }
  }
`;

const RECRUITMENT_PERIOD_QUERY = gql`
  query RecruitmentPeriod($type: String!) {
    recruitmentPeriod(type: $type) {
      id type startDate endDate isActive
    }
  }
`;

const SUBMIT_APPLICATION = gql`
  mutation SubmitApplication($input: ApplicationSubmissionInput!) {
    submitApplication(input: $input) { id status }
  }
`;

const CANCEL_APPLICATION = gql`
  mutation CancelApplication($id: ID!) {
    cancelApplication(id: $id) { id status }
  }
`;

const APPLICATIONS_QUERY = gql`
  query Applications($filter: ApplicationFilterInput) {
    applications(filter: $filter) {
      items { id applicantName applicantEmail track status submittedAt }
      total page size
    }
  }
`;

const APPROVE_APPLICATION = gql`
  mutation ApproveApplication($id: ID!) {
    approveApplication(id: $id) { id status }
  }
`;

const BATCH_APPROVE = gql`
  mutation BatchApproveApplications($ids: [ID!]!) {
    batchApproveApplications(ids: $ids) { count }
  }
`;

export async function getMyApplication(): Promise<MyApplication | null> {
  const data = await gqlClient.request<{ myApplication: MyApplication | null }>(
    MY_APPLICATION_QUERY,
  );
  return data.myApplication;
}

export async function getFormTemplate(type: string): Promise<FormTemplate> {
  const data = await gqlClient.request<{ formTemplate: FormTemplate }>(
    FORM_TEMPLATE_QUERY,
    { type },
  );
  return data.formTemplate;
}

export async function getRecruitmentPeriod(type: string): Promise<RecruitmentPeriod | null> {
  const data = await gqlClient.request<{ recruitmentPeriod: RecruitmentPeriod | null }>(
    RECRUITMENT_PERIOD_QUERY,
    { type },
  );
  return data.recruitmentPeriod;
}

export async function submitApplication(input: ApplicationSubmission): Promise<MyApplication> {
  const data = await gqlClient.request<{ submitApplication: MyApplication }>(
    SUBMIT_APPLICATION,
    { input },
  );
  return data.submitApplication;
}

export async function cancelApplication(id: string): Promise<MyApplication> {
  const data = await gqlClient.request<{ cancelApplication: MyApplication }>(
    CANCEL_APPLICATION,
    { id },
  );
  return data.cancelApplication;
}

export async function getApplications(
  filter: Record<string, unknown>,
): Promise<PagedResponse<ApplicationListItem>> {
  const data = await gqlClient.request<{ applications: PagedResponse<ApplicationListItem> }>(
    APPLICATIONS_QUERY,
    { filter },
  );
  return data.applications;
}

export async function approveApplication(id: string): Promise<MyApplication> {
  const data = await gqlClient.request<{ approveApplication: MyApplication }>(
    APPROVE_APPLICATION,
    { id },
  );
  return data.approveApplication;
}

export async function batchApproveApplications(ids: string[]): Promise<{ count: number }> {
  const data = await gqlClient.request<{ batchApproveApplications: { count: number } }>(
    BATCH_APPROVE,
    { ids },
  );
  return data.batchApproveApplications;
}
