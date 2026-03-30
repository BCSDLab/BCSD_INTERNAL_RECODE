import { gql } from "graphql-request";
import { gqlClient } from "./graphql-client";
import type { Form, Application, SubmitInput } from "@/types/application";

const FORM_QUERY = gql`
  query Form($id: ID!) {
    form(id: $id) {
      id title description recruitmentId type isActive createdBy createdAt updatedAt
      questions { id label type options required sortOrder }
    }
  }
`;

const FORMS_QUERY = gql`
  query Forms($recruitmentId: String!) {
    forms(recruitmentId: $recruitmentId) {
      id title description recruitmentId type isActive createdBy createdAt updatedAt
      questions { id label type options required sortOrder }
    }
  }
`;

const MY_APPLICATIONS_QUERY = gql`
  query MyApplications {
    myApplications {
      id formId memberId status submittedAt approvedAt approvedBy updatedAt
      answers { id questionId value }
    }
  }
`;

const APPLICATIONS_QUERY = gql`
  query Applications($formId: String!) {
    applications(formId: $formId) {
      id formId memberId status submittedAt approvedAt approvedBy updatedAt
      answers { id questionId value }
    }
  }
`;

const APPLICATION_QUERY = gql`
  query Application($id: ID!) {
    application(id: $id) {
      id formId memberId status submittedAt approvedAt approvedBy updatedAt
      answers { id questionId value }
    }
  }
`;

const SUBMIT_APPLICATION = gql`
  mutation SubmitApplication($input: SubmitInput!) {
    submitApplication(input: $input) {
      id formId status submittedAt
    }
  }
`;

const APPROVE_APPLICATIONS = gql`
  mutation ApproveApplications($ids: [ID!]!) {
    approveApplications(ids: $ids) {
      id status approvedAt
    }
  }
`;

const CANCEL_APPLICATION = gql`
  mutation CancelApplication($id: ID!) {
    cancelApplication(id: $id) {
      id status
    }
  }
`;

export async function getForm(id: string): Promise<Form> {
  const data = await gqlClient.request<{ form: Form }>(FORM_QUERY, { id });
  return data.form;
}

export async function getForms(recruitmentId: string): Promise<Form[]> {
  const data = await gqlClient.request<{ forms: Form[] }>(FORMS_QUERY, { recruitmentId });
  return data.forms;
}

export async function getMyApplications(): Promise<Application[]> {
  const data = await gqlClient.request<{ myApplications: Application[] }>(MY_APPLICATIONS_QUERY);
  return data.myApplications;
}

export async function getApplications(formId: string): Promise<Application[]> {
  const data = await gqlClient.request<{ applications: Application[] }>(APPLICATIONS_QUERY, { formId });
  return data.applications;
}

export async function getApplication(id: string): Promise<Application> {
  const data = await gqlClient.request<{ application: Application }>(APPLICATION_QUERY, { id });
  return data.application;
}

export async function submitApplication(input: SubmitInput): Promise<Application> {
  const data = await gqlClient.request<{ submitApplication: Application }>(SUBMIT_APPLICATION, { input });
  return data.submitApplication;
}

export async function approveApplications(ids: string[]): Promise<Application[]> {
  const data = await gqlClient.request<{ approveApplications: Application[] }>(APPROVE_APPLICATIONS, { ids });
  return data.approveApplications;
}

export async function cancelApplication(id: string): Promise<Application> {
  const data = await gqlClient.request<{ cancelApplication: Application }>(CANCEL_APPLICATION, { id });
  return data.cancelApplication;
}
