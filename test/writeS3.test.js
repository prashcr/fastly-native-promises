'use strict';

/* eslint-env mocha */

const nock = require('nock');
const expect = require('expect');
const config = require('../src/config');
const fastlyPromises = require('../src/index');
const readresponse = require('./response/readS3.response');
const createresponse = require('./response/createS3.response');

describe('#writeS3', () => {
  const fastly = fastlyPromises('923b6bd5266a7f932e41962755bd4254', 'SU1Z0isxPaozGVKXdv0eY');
  let res;

  nock(config.mainEntryPoint)
    .get('/service/SU1Z0isxPaozGVKXdv0eY/version/1/logging/s3/test-s3')
    .reply(404, readresponse.readS3404)
    .post('/service/SU1Z0isxPaozGVKXdv0eY/version/1/logging/s3')
    .reply(200, createresponse.createS3);

  before(async () => {
    res = await fastly.writeS3('1', 'test-s3', {
      name: 'test-s3',
      bucket_name: 'my_corporate_bucket',
      access_key: 'AKIAIOSFODNN7EXAMPLE',
      secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    });
  });

  it('response should be a status 200', () => {
    expect(res.status).toBe(200);
  });

  it('response body should exist', () => {
    expect(res.data).toBeTruthy();
  });

  it('response body should be an object', () => {
    expect(typeof res.data).toBe('object');
  });

  it('response body should contain all properties', () => {
    [
      'access_key',
      'bucket_name',
      'created_at',
      'deleted_at',
      'domain',
      'format',
      'format_version',
      'gzip_level',
      'message_type',
      'name',
      'path',
      'period',
      'placement',
      'redundancy',
      'response_condition',
      'secret_key',
      'service_id',
      'timestamp_format',
      'updated_at',
      'version',
    ].forEach((e) => {
      expect(Object.keys(res.data)).toContain(e);
    });
  });
});
