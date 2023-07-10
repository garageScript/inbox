import {
  AggregationsStringTermsBucket,
  AggregationsTermsAggregateBase
} from "@elastic/elasticsearch/lib/api/types";
import {
  addressToUsername,
  elasticsearchClient,
  getUserDomain,
  index,
  TO_ADDRESS_FIELD
} from "server";

export type Username = string;
export type BadgeCount = number;
export class Notifications extends Map<Username, BadgeCount> {}

interface AddressAggregation {
  address: AggregationsTermsAggregateBase<AddressAggregationBucket>;
}

type AddressAggregationBucket = AggregationsStringTermsBucket & {
  read: AggregationsTermsAggregateBase<AggregationsStringTermsBucket>;
};

export const getNotifications = async (
  usernames: string[]
): Promise<Notifications> => {
  const matchUsername = usernames.map((username) => {
    const userDomain = getUserDomain(username);
    return {
      query_string: {
        default_field: TO_ADDRESS_FIELD,
        query: `*@${userDomain}`
      }
    };
  });

  const response = elasticsearchClient.search<Document, AddressAggregation>({
    index,
    size: 0,
    query: { bool: { should: matchUsername } },
    aggs: {
      address: {
        terms: { field: TO_ADDRESS_FIELD, size: 10000 },
        aggs: { read: { terms: { field: "read", size: 10000 } } }
      }
    }
  });

  const notifications = new Notifications();

  await response.then((r) => {
    const buckets = r.aggregations?.address.buckets;
    if (!Array.isArray(buckets)) return;
    buckets?.forEach((e) => {
      const { buckets } = e.read;
      if (!Array.isArray(buckets)) return;
      const badgeCount = buckets.find((f) => !f.key)?.doc_count;
      if (!badgeCount) return;
      const username = addressToUsername(e.key);
      const existing = notifications.get(username) || 0;
      notifications.set(username, badgeCount + existing);
    });
  });

  return notifications;
};
