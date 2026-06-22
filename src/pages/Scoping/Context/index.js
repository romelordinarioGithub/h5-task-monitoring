import React, { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getScopingPricing, resetScopingPricing } from 'store/reducers/scoping';
import { masterRateCardRows } from '../mockData';

const currencyFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
});

const ScopingContext = createContext();

const SCOPING_TEMPLATE_VALUES = {
  DEFAULT: 'Default template',
  RATE_CARD_2026: '2026 Rate Card',
};

const SCOPING_TEMPLATE_OPTIONS = [
  {
    value: SCOPING_TEMPLATE_VALUES.DEFAULT,
    label: 'Default template',
  },
  {
    value: SCOPING_TEMPLATE_VALUES.RATE_CARD_2026,
    label: '2026 Rate Card',
  },
];

const descriptionPartsToText = (parts = []) =>
  parts
    .map((part) => {
      if (part.type === 'list') {
        return [part.label, ...part.items.map((item) => `- ${item}`)].join(
          '\n'
        );
      }

      if (part.type === 'note') {
        return `** ${part.text}`;
      }

      return part.text || '';
    })
    .filter(Boolean)
    .join('\n\n');

const getInitialRows = () =>
  masterRateCardRows.map((row) => {
    if (row.type === 'service') {
      return {
        ...row,
        description: descriptionPartsToText(row.description),
      };
    }

    return row;
  });

const parsePackageUnits = (value) => {
  const normalized = String(value || '').trim();

  if (!/^\d+$/.test(normalized)) return 0;

  return Number(normalized);
};

const formatCurrency = (value) => currencyFormatter.format(value);

const normalizeServiceKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const defaultServiceRowIds = masterRateCardRows.reduce((nextRows, row) => {
  if (row.type === 'service') {
    nextRows[normalizeServiceKey(row.serviceType)] = row.id;
  }

  return nextRows;
}, {});

const findDefaultServiceRowId = (value) => {
  const serviceKey = normalizeServiceKey(value);

  if (!serviceKey) return undefined;
  if (defaultServiceRowIds[serviceKey]) return defaultServiceRowIds[serviceKey];

  const matchingService = Object.entries(defaultServiceRowIds).find(
    ([defaultServiceKey]) =>
      serviceKey.length > 4 &&
      defaultServiceKey.length > 4 &&
      (serviceKey.includes(defaultServiceKey) ||
        defaultServiceKey.includes(serviceKey))
  );

  return matchingService ? matchingService[1] : undefined;
};

const readFirst = (source, keys) => {
  if (!source || typeof source !== 'object') return undefined;

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const slugify = (value, fallback = 'item') => {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || fallback;
};

const titleize = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeHeader = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+([a-z0-9])/g, (_, char) => char.toUpperCase());

const parseCsvText = (csv) => {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentCell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index += 1;

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  const [headers = [], ...bodyRows] = rows.filter((row) =>
    row.some((cell) => String(cell || '').trim())
  );

  return bodyRows.map((row) =>
    headers.reduce((nextRow, header, index) => {
      nextRow[normalizeHeader(header)] = row[index] || '';
      return nextRow;
    }, {})
  );
};

const unwrapPricingResponse = (response) => {
  if (typeof response === 'string') {
    try {
      return JSON.parse(response);
    } catch (err) {
      return parseCsvText(response);
    }
  }

  if (response && response.data !== undefined) {
    return response.data;
  }

  return response;
};

const extractDirectArray = (source, keys) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(source[key])) {
      return source[key];
    }
  }

  return [];
};

const extractArray = (source, keys) => {
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== 'object') return [];

  for (const key of keys) {
    if (Array.isArray(source[key])) {
      return source[key];
    }
  }

  const nested = readFirst(source, [
    'data',
    'result',
    'results',
    'scoping',
    'scope',
    'pricingData',
    'pricing_data',
  ]);

  if (nested && nested !== source) {
    return extractArray(nested, keys);
  }

  return [];
};

const normalizeDescription = (value) => {
  if (Array.isArray(value)) {
    if (value.some((part) => part && typeof part === 'object')) {
      return descriptionPartsToText(value);
    }

    return value.filter(Boolean).join('\n');
  }

  if (value && typeof value === 'object') {
    return (
      readFirst(value, ['text', 'label', 'value', 'name']) ||
      JSON.stringify(value)
    );
  }

  return value || '';
};

const normalizePriceValue = (value) => {
  if (value === undefined || value === null || value === '') return '';

  if (typeof value === 'string' && /[€$£]/.test(value)) {
    return value;
  }

  const numericValue = Number(String(value).replace(/,/g, ''));

  return Number.isNaN(numericValue)
    ? String(value)
    : formatCurrency(numericValue);
};

const normalizeFormatList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeDescription(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const PACKAGE_TOTAL_KEYS = [
  'packageTotal',
  'package_total',
  'totalPrice',
  'total_price',
  'priceTotal',
  'price_total',
  'total',
  'price',
  'amount',
  'cost',
];

const LINE_PRICE_KEYS = [
  'lineTotal',
  'line_total',
  'totalPrice',
  'total_price',
  'priceTotal',
  'price_total',
  'total',
  'price',
  'amount',
  'cost',
];

const PACKAGE_ROW_KEYS = [
  'rows',
  'items',
  'services',
  'prices',
  'pricing',
  'lineItems',
  'line_items',
];

const RATE_CARD_COUNT_QUANTITY_FIELDS = [
  {
    rowId: 'additional-creative-template',
    keys: ['sizesCount', 'sizes_count'],
  },
  {
    rowId: 'creative-template-resize',
    keys: ['additionalSizesCount', 'additional_sizes_count'],
  },
];

const isPricingItem = (item) =>
  item &&
  typeof item === 'object' &&
  [
    'serviceType',
    'service_type',
    'serviceDescription',
    'service_description',
    'price',
    'unit',
    'quantity',
    'qty',
  ].some((key) => item[key] !== undefined && item[key] !== null);

const getGroupedPricingEntries = (source) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return [];
  }

  return Object.entries(source).reduce((groups, [platformKey, value]) => {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      !value.some((item) => extractDirectArray(item, PACKAGE_ROW_KEYS).length) &&
      value.some((item) => isPricingItem(item))
    ) {
      groups.push({
        platformKey,
        title: titleize(platformKey),
        rows: value,
        source: {},
      });

      return groups;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const rows = extractDirectArray(value, PACKAGE_ROW_KEYS);

      if (rows.length > 0 && rows.some((item) => isPricingItem(item))) {
        groups.push({
          platformKey,
          title:
            normalizeDescription(
              readFirst(value, ['title', 'label', 'name', 'platform'])
            ) || titleize(platformKey),
          rows,
          source: value,
        });
      }
    }

    return groups;
  }, []);
};

const findGroupedPricingEntries = (source, seen = new Set()) => {
  if (!source || typeof source !== 'object' || seen.has(source)) {
    return [];
  }

  seen.add(source);

  const directGroups = getGroupedPricingEntries(source);

  if (directGroups.length > 0) {
    return directGroups;
  }

  for (const value of Object.values(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedGroups = findGroupedPricingEntries(value, seen);

      if (nestedGroups.length > 0) {
        return nestedGroups;
      }
    }
  }

  return [];
};

const buildGroupedRowDescription = (row) => {
  const sizes = readFirst(row, ['sizes', 'size']);
  const additionalSizes = readFirst(row, [
    'additionalSizes',
    'additional_sizes',
    'additionalSize',
    'additional_size',
  ]);
  const parts = [
    readFirst(row, ['serviceType', 'service_type']) &&
      `Service type: ${readFirst(row, ['serviceType', 'service_type'])}`,
    sizes && `Sizes: ${sizes}`,
    additionalSizes && `Additional sizes: ${additionalSizes}`,
    readFirst(row, ['duration']) && `Duration: ${readFirst(row, ['duration'])}`,
    readFirst(row, ['sizesCount', 'sizes_count']) !== undefined &&
      `Sizes count: ${readFirst(row, ['sizesCount', 'sizes_count'])}`,
    readFirst(row, ['additionalSizesCount', 'additional_sizes_count']) !==
      undefined &&
      `Additional sizes count: ${readFirst(row, [
        'additionalSizesCount',
        'additional_sizes_count',
      ])}`,
  ].filter(Boolean);

  return parts.join('\n');
};

const getGroupedRowId = (group, row, index) => {
  const serviceDescription = readFirst(row, [
    'serviceDescription',
    'service_description',
    'description',
    'name',
    'title',
  ]);

  return `${slugify(group.platformKey)}-${slugify(
    serviceDescription || readFirst(row, ['serviceType', 'service_type']),
    'service'
  )}-${index + 1}`;
};

const uniqueList = (list) => [...new Set(list.filter(Boolean))];

const buildGroupedScope = (groups, briefId) => {
  const rateCardRows = groups.flatMap((group) => [
    {
      type: 'section',
      id: slugify(group.platformKey),
      title: group.title,
    },
    ...group.rows.map((row, index) => ({
      type: 'service',
      id: getGroupedRowId(group, row, index),
      serviceType:
        readFirst(row, [
          'serviceDescription',
          'service_description',
          'description',
          'name',
          'title',
        ]) || readFirst(row, ['serviceType', 'service_type']),
      description: buildGroupedRowDescription(row),
      price: normalizePriceValue(readFirst(row, ['price'])),
      platformKey: group.platformKey,
      platform: group.title,
    })),
  ]);
  const briefs = groups.map((group) => ({
    id: `${briefId}-${group.platformKey}`,
    title: group.title,
    platform: group.title,
    formats: uniqueList(
      group.rows.flatMap((row) =>
        normalizeFormatList(
          [
            readFirst(row, ['sizes', 'size']),
            readFirst(row, [
              'additionalSizes',
              'additional_sizes',
              'additionalSize',
              'additional_size',
            ]),
          ]
            .filter(Boolean)
            .join(', ')
        )
      )
    ),
    quantities: group.rows.reduce((nextQuantities, row, index) => {
      const unit = parsePackageUnits(
        readFirst(row, ['unit', 'quantity', 'qty'])
      );

      nextQuantities[getGroupedRowId(group, row, index)] = String(unit || 1);

      return nextQuantities;
    }, {}),
  }));

  return {
    rateCardRows,
    briefs,
  };
};

const readServiceName = (row) =>
  readFirst(row, [
    'serviceName',
    'service_name',
    'serviceDescription',
    'service_description',
    'description',
    'serviceType',
    'service_type',
    'service',
    'name',
    'label',
    'title',
  ]);

const readServiceNameCandidates = (row) =>
  [
    'serviceName',
    'service_name',
    'serviceDescription',
    'service_description',
    'description',
    'serviceType',
    'service_type',
    'service',
    'name',
    'label',
    'title',
  ]
    .map((key) => readFirst(row, [key]))
    .filter(Boolean);

const getServiceRowId = (row, index = 0) => {
  const serviceNameCandidates = readServiceNameCandidates(row);
  const defaultRowId = serviceNameCandidates
    .map((serviceName) => findDefaultServiceRowId(serviceName))
    .find(Boolean);

  if (defaultRowId) return defaultRowId;

  const serviceName = serviceNameCandidates[0];

  return String(
    readFirst(row, ['id', 'key', 'slug', 'serviceId', 'service_id']) ||
      slugify(serviceName, `service-${index + 1}`)
  );
};

const flattenPricingRows = (rows = []) =>
  rows.reduce((nextRows, row) => {
    const children = extractArray(row, [
      'rows',
      'items',
      'services',
      'children',
      'prices',
      'lineItems',
      'line_items',
    ]);

    if (children.length === 0) {
      nextRows.push(row);
      return nextRows;
    }

    const sectionTitle =
      readFirst(row, ['sectionTitle', 'section_title', 'title', 'name']) ||
      'General Items';
    const sectionId = String(
      readFirst(row, ['sectionId', 'section_id', 'id', 'key']) ||
        slugify(sectionTitle)
    );

    nextRows.push({
      type: 'section',
      id: sectionId,
      title: sectionTitle,
    });

    children.forEach((child) => {
      nextRows.push({
        ...child,
        sectionId,
        sectionTitle,
      });
    });

    return nextRows;
  }, []);

const normalizeRateCardRows = (rows = []) => {
  const nextRows = [];
  const seenSections = new Set();
  const flattenedRows = flattenPricingRows(rows);

  flattenedRows.forEach((row, index) => {
    const rowType = String(
      readFirst(row, ['type', 'rowType', 'row_type']) || ''
    )
      .trim()
      .toLowerCase();
    const serviceName = readServiceName(row);
    const price = readFirst(row, [
      'price',
      'basePrice',
      'base_price',
      'unitPrice',
      'unit_price',
      'rate',
    ]);
    const sectionTitle = readFirst(row, [
      'sectionTitle',
      'section_title',
      'section',
      'category',
      'group',
    ]);

    if (rowType === 'section' || (!serviceName && sectionTitle)) {
      const title =
        readFirst(row, ['title', 'sectionTitle', 'section_title', 'name']) ||
        sectionTitle;
      const id = String(
        readFirst(row, ['id', 'key', 'sectionId', 'section_id']) ||
          slugify(title)
      );

      if (!seenSections.has(id)) {
        nextRows.push({ type: 'section', id, title });
        seenSections.add(id);
      }

      return;
    }

    if (!serviceName) return;

    if (sectionTitle) {
      const sectionId = String(
        readFirst(row, ['sectionId', 'section_id']) || slugify(sectionTitle)
      );

      if (!seenSections.has(sectionId)) {
        nextRows.push({
          type: 'section',
          id: sectionId,
          title: sectionTitle,
        });
        seenSections.add(sectionId);
      }
    }

    nextRows.push({
      type: 'service',
      id: getServiceRowId(row, index),
      serviceType: serviceName,
      description: normalizeDescription(
        readFirst(row, ['description', 'details', 'notes', 'note'])
      ),
      price: normalizePriceValue(price),
    });
  });

  return nextRows;
};

const normalizeQuantityMap = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((nextQuantities, [key, quantity]) => {
    const parsedQuantity = parsePackageUnits(quantity);

    if (parsedQuantity > 0) {
      nextQuantities[key] = String(parsedQuantity);
    }

    return nextQuantities;
  }, {});
};

const normalizeQuantities = (source) => {
  const objectQuantities = normalizeQuantityMap(source);

  if (Object.keys(objectQuantities).length > 0) {
    return objectQuantities;
  }

  const rows = flattenPricingRows(Array.isArray(source) ? source : []);

  return rows.reduce((nextQuantities, row, index) => {
    const quantity = readFirst(row, [
      'unit',
      'quantity',
      'qty',
      'units',
      'count',
      'selectedQuantity',
      'selected_quantity',
    ]);
    const parsedQuantity = parsePackageUnits(quantity);

    if (parsedQuantity > 0) {
      nextQuantities[getServiceRowId(row, index)] = String(parsedQuantity);
    }

    return nextQuantities;
  }, {});
};

const readMappedCountFromObject = (source, keys) => {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return 0;
  }

  return parsePackageUnits(readFirst(source, keys));
};

const readMappedCountFromRows = (rows = [], keys) =>
  flattenPricingRows(rows).reduce(
    (total, row) => total + parsePackageUnits(readFirst(row, keys)),
    0
  );

const mapRateCardCountQuantities = ({
  quantities = {},
  quantitySource,
  rows = [],
  source = {},
}) => {
  const nextQuantities = { ...quantities };

  RATE_CARD_COUNT_QUANTITY_FIELDS.forEach(({ rowId, keys }) => {
    keys.forEach((key) => {
      delete nextQuantities[key];
    });

    const count =
      readMappedCountFromObject(source, keys) ||
      readMappedCountFromObject(quantitySource, keys) ||
      readMappedCountFromRows(
        Array.isArray(quantitySource) ? quantitySource : rows,
        keys
      );

    if (count > 0) {
      nextQuantities[rowId] = String(count);
    }
  });

  return nextQuantities;
};

const buildBriefFromPayload = (source = {}, rows = [], briefId, index = 0) => {
  const title =
    normalizeDescription(
      readFirst(source, ['title', 'briefTitle', 'brief_title', 'name', 'label'])
    ) || `Brief ${briefId || index + 1}`;
  const quantitySource =
    readFirst(source, [
      'quantities',
      'quantityMap',
      'quantity_map',
      'items',
      'rows',
      'services',
      'prices',
      'lineItems',
      'line_items',
    ]) || rows;

  return {
    id: String(
      readFirst(source, ['id', 'briefId', 'brief_id', 'key']) ||
        `brief-${briefId || index + 1}`
    ),
    title,
    platform:
      normalizeDescription(
        readFirst(source, ['platform', 'channel', 'publisher'])
      ) || 'Meta',
    formats: normalizeFormatList(
      readFirst(source, ['formats', 'format', 'dimensions', 'sizes'])
    ),
    quantities: normalizeQuantities(quantitySource),
  };
};

const normalizePricingResponse = (response, briefId) => {
  const payload = unwrapPricingResponse(response);
  const pricingPayload = unwrapPricingResponse(payload);
  const groupedPricingEntries = findGroupedPricingEntries(pricingPayload);

  if (groupedPricingEntries.length > 0) {
    return buildGroupedScope(groupedPricingEntries, briefId);
  }

  const rows = extractArray(pricingPayload, [
    'rateCardRows',
    'rate_card_rows',
    'rows',
    'items',
    'services',
    'prices',
    'pricing',
    'lineItems',
    'line_items',
  ]);
  const briefSources = Array.isArray(pricingPayload)
    ? []
    : extractArray(pricingPayload, [
        'briefs',
        'packages',
        'scopes',
        'scopingBriefs',
        'scoping_briefs',
      ]);
  const briefPayload =
    readFirst(pricingPayload, ['brief', 'adweaveBrief', 'adweave_brief']) ||
    pricingPayload ||
    {};
  const nextBriefs =
    briefSources.length > 0
      ? briefSources.map((brief, index) =>
          buildBriefFromPayload(brief, rows, briefId, index)
        )
      : [buildBriefFromPayload(briefPayload, rows, briefId)];

  return {
    rateCardRows: normalizeRateCardRows(rows),
    briefs: nextBriefs,
  };
};

const parsePriceNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;

  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));

  return Number.isNaN(parsed) ? null : parsed;
};

const sumLinePrices = (rows = []) => {
  const total = rows.reduce(
    (nextTotal, row) => {
      const price = parsePriceNumber(readFirst(row, LINE_PRICE_KEYS));

      if (price === null) return nextTotal;

      return {
        amount: nextTotal.amount + price,
        hasPrice: true,
      };
    },
    { amount: 0, hasPrice: false }
  );

  return total.hasPrice ? total.amount : undefined;
};

const getPackageTotalValue = (source = {}, rows = []) => {
  const packageTotal = readFirst(source, PACKAGE_TOTAL_KEYS);

  if (
    packageTotal !== undefined &&
    packageTotal !== null &&
    String(packageTotal).trim() !== ''
  ) {
    return packageTotal;
  }

  return sumLinePrices(rows);
};

const collectPackageFormats = (source = {}, rows = []) =>
  uniqueList(
    [
      readFirst(source, ['formats', 'format', 'dimensions']),
      readFirst(source, ['sizes', 'size']),
      readFirst(source, [
        'additionalSizes',
        'additional_sizes',
        'additionalSize',
        'additional_size',
      ]),
      ...rows.flatMap((row) => [
        readFirst(row, ['sizes', 'size']),
        readFirst(row, [
          'additionalSizes',
          'additional_sizes',
          'additionalSize',
          'additional_size',
        ]),
      ]),
    ].flatMap((value) => normalizeFormatList(value))
  );

const buildRateCardBriefFromRows = ({
  source = {},
  rows = [],
  briefId,
  index = 0,
  fallbackId,
  fallbackTitle,
}) => {
  const title =
    normalizeDescription(
      readFirst(source, [
        'title',
        'briefTitle',
        'brief_title',
        'name',
        'label',
        'platform',
      ])
    ) ||
    fallbackTitle ||
    `Brief ${briefId || index + 1}`;
  const packageTotal = getPackageTotalValue(source, rows);
  const quantitySource =
    readFirst(source, [
      'quantities',
      'quantityMap',
      'quantity_map',
      'items',
      'rows',
      'services',
      'prices',
      'lineItems',
      'line_items',
    ]) || rows;
  const quantities = mapRateCardCountQuantities({
    quantities: normalizeQuantities(quantitySource),
    quantitySource,
    rows,
    source,
  });
  const brief = {
    id: String(
      readFirst(source, ['id', 'briefId', 'brief_id', 'key']) ||
        fallbackId ||
        `brief-${briefId || index + 1}`
    ),
    title,
    platform:
      normalizeDescription(
        readFirst(source, ['platform', 'channel', 'publisher'])
      ) || title,
    formats: collectPackageFormats(source, rows),
    quantities,
    initialQuantities: quantities,
  };

  if (packageTotal !== undefined) {
    brief.packageTotal = packageTotal;
  }

  return brief;
};

const normalizeRateCardPricingResponse = (response, briefId) => {
  const payload = unwrapPricingResponse(response);
  const pricingPayload = unwrapPricingResponse(payload);
  const groupedPricingEntries = findGroupedPricingEntries(pricingPayload);

  if (groupedPricingEntries.length > 0) {
    return {
      rateCardRows: getInitialRows(),
      briefs: groupedPricingEntries.map((group, index) =>
        buildRateCardBriefFromRows({
          source: group.source,
          rows: group.rows,
          briefId,
          index,
          fallbackId: `${briefId || 'brief'}-${slugify(group.platformKey)}`,
          fallbackTitle: group.title,
        })
      ),
    };
  }

  const rows = extractArray(pricingPayload, [
    'rateCardRows',
    'rate_card_rows',
    ...PACKAGE_ROW_KEYS,
  ]);
  const briefSources = Array.isArray(pricingPayload)
    ? []
    : extractArray(pricingPayload, [
        'briefs',
        'packages',
        'scopes',
        'scopingBriefs',
        'scoping_briefs',
      ]);
  const briefPayload =
    readFirst(pricingPayload, ['brief', 'adweaveBrief', 'adweave_brief']) ||
    pricingPayload ||
    {};
  const nextBriefs =
    briefSources.length > 0
      ? briefSources.map((brief, index) => {
          const packageRows = extractDirectArray(brief, PACKAGE_ROW_KEYS);

          return buildRateCardBriefFromRows({
            source: brief,
            rows: packageRows.length > 0 ? packageRows : rows,
            briefId,
            index,
          });
        })
      : [
          buildRateCardBriefFromRows({
            source: briefPayload,
            rows,
            briefId,
          }),
        ];

  return {
    rateCardRows: getInitialRows(),
    briefs: nextBriefs,
  };
};

const isNotFoundResponse = (response) => {
  const status = response && response.status;
  const message = String(
    (response && (response.message || response.error)) || ''
  );

  return (
    status === 404 || /not found|no query results|does not exist/i.test(message)
  );
};

export function ScopingProvider({ children }) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { briefId: routeBriefId } = useParams();
  const {
    pricing: { fetching: isFetchingScope },
    error: pricingError,
  } = useSelector((state) => state.scoping);
  const queryBriefId = useMemo(() => {
    const params = new URLSearchParams(location.search || '');

    return params.get('id') || params.get('brief_id');
  }, [location.search]);
  const briefId = routeBriefId || queryBriefId;
  const shouldRedirectToCanonicalUrl = !routeBriefId && queryBriefId;
  const [selectedTemplate, setSelectedTemplate] = useState(
    SCOPING_TEMPLATE_VALUES.RATE_CARD_2026
  );
  const [rateCardRows, setRateCardRows] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [scopeError, setScopeError] = useState('');
  const isLoadingScope = isFetchingScope;

  useEffect(() => {
    if (shouldRedirectToCanonicalUrl) {
      history.replace(`/scoping/${queryBriefId}`);
      return;
    }

    if (!briefId) {
      history.replace('/');
    }
  }, [briefId, history, queryBriefId, shouldRedirectToCanonicalUrl]);

  useEffect(() => {
    if (selectedTemplate !== SCOPING_TEMPLATE_VALUES.RATE_CARD_2026) return;
    if (!briefId || shouldRedirectToCanonicalUrl) return undefined;

    let isMounted = true;

    const fetchScopePricing = async () => {
      setScopeError('');
      setRateCardRows(getInitialRows());
      setBriefs([]);

      try {
        const result = await dispatch(getScopingPricing(briefId));

        if (!isMounted) return;

        if (!result.success) {
          if (isNotFoundResponse(result.response)) {
            history.replace('/');
            return;
          }

          throw new Error(result.message || 'Unable to load scoping pricing');
        }

        const nextScope = normalizeRateCardPricingResponse(
          result.data,
          briefId
        );

        if (nextScope.briefs.length === 0) {
          const message = 'No scoping pricing found for this brief.';

          setScopeError(message);
          setStatusMessage(message);
          return;
        }

        setRateCardRows(nextScope.rateCardRows);
        setBriefs(nextScope.briefs);
      } catch (error) {
        if (!isMounted) return;

        const message =
          (error && error.message) || 'Unable to load scoping pricing';

        setRateCardRows(getInitialRows());
        setBriefs([]);
        setScopeError(message);
        setStatusMessage(message);
      }
    };

    fetchScopePricing();

    return () => {
      isMounted = false;
      dispatch(resetScopingPricing());
    };
  }, [
    briefId,
    dispatch,
    history,
    selectedTemplate,
    shouldRedirectToCanonicalUrl,
  ]);

  useEffect(() => {
    if (selectedTemplate !== SCOPING_TEMPLATE_VALUES.DEFAULT) return undefined;
    if (!briefId || shouldRedirectToCanonicalUrl) return undefined;

    let isMounted = true;

    const fetchScopePricing = async () => {
      setScopeError('');
      setRateCardRows([]);
      setBriefs([]);

      try {
        const result = await dispatch(getScopingPricing(briefId));

        if (!isMounted) return;

        if (!result.success) {
          if (isNotFoundResponse(result.response)) {
            history.replace('/');
            return;
          }

          throw new Error(result.message || 'Unable to load scoping pricing');
        }

        const nextScope = normalizePricingResponse(result.data, briefId);

        if (nextScope.rateCardRows.length === 0) {
          const message = 'No scoping pricing found for this brief.';

          setScopeError(message);
          setStatusMessage(message);
          return;
        }

        setRateCardRows(nextScope.rateCardRows);
        setBriefs(nextScope.briefs);
      } catch (error) {
        if (!isMounted) return;

        const message =
          (error && error.message) || 'Unable to load scoping pricing';

        setRateCardRows([]);
        setBriefs([]);
        setScopeError(message);
        setStatusMessage(message);
      }
    };

    fetchScopePricing();

    return () => {
      isMounted = false;
      dispatch(resetScopingPricing());
    };
  }, [
    briefId,
    dispatch,
    history,
    selectedTemplate,
    shouldRedirectToCanonicalUrl,
  ]);

  return (
    <ScopingContext.Provider
      value={{
        briefId,
        rateCardRows,
        setRateCardRows,
        briefs,
        setBriefs,
        statusMessage,
        setStatusMessage,
        isLoadingScope,
        selectedTemplate,
        setSelectedTemplate,
        templateOptions: SCOPING_TEMPLATE_OPTIONS,
        scopeError:
          selectedTemplate === SCOPING_TEMPLATE_VALUES.DEFAULT
            ? scopeError || pricingError
            : scopeError,
      }}
    >
      {children}
    </ScopingContext.Provider>
  );
}

ScopingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ScopingContext;
